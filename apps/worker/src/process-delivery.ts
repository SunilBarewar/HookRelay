import { getDeliveryForProcessing, recordDeliveryAttempt } from "@hookrelay/db";
import { MAX_ATTEMPTS, retryDelayMs, type DeliveryJob } from "@hookrelay/queue";

import { sendWebhook } from "./send-webhook.ts";

/**
 * Delivers one webhook. Postgres is the source of truth: the job only carries the delivery id.
 * Throwing is what makes BullMQ retry, so every failed attempt with retries left throws.
 */
export async function deliverWebhook(job: DeliveryJob): Promise<void> {
  const { deliveryId } = job.data;
  const delivery = await getDeliveryForProcessing(deliveryId);

  if (!delivery) {
    // Deleted (e.g. its endpoint or application was removed) since it was queued. Nothing to retry.
    console.warn(`[worker] delivery ${deliveryId} no longer exists, skipping`);
    return;
  }

  // A job can run twice (e.g. a stalled job is picked up again); never re-send a finished delivery.
  if (delivery.status === "success" || delivery.status === "dead_lettered") {
    return;
  }

  const attempt = job.attemptsMade + 1;

  if (delivery.endpoint.status !== "active") {
    await recordDeliveryAttempt(deliveryId, {
      status: "dead_lettered",
      attempts: attempt,
      responseCode: null,
      responseBody: null,
      errorMessage: "Endpoint is disabled",
      nextAttemptAt: null,
      deliveredAt: null,
    });
    return;
  }

  const result = await sendWebhook({
    url: delivery.endpoint.url,
    signingSecret: delivery.endpoint.signingSecret,
    deliveryId,
    eventId: delivery.event.id,
    eventType: delivery.event.eventType,
    eventCreatedAt: delivery.event.createdAt,
    data: delivery.event.payload,
  });

  if (result.ok) {
    await recordDeliveryAttempt(deliveryId, {
      status: "success",
      attempts: attempt,
      responseCode: result.statusCode,
      responseBody: result.body,
      errorMessage: null,
      nextAttemptAt: null,
      deliveredAt: new Date(),
    });
    return;
  }

  const maxAttempts = job.opts.attempts ?? MAX_ATTEMPTS;
  const exhausted = attempt >= maxAttempts;

  await recordDeliveryAttempt(deliveryId, {
    status: exhausted ? "dead_lettered" : "failed",
    attempts: attempt,
    responseCode: result.statusCode,
    responseBody: result.body,
    errorMessage: result.error,
    nextAttemptAt: exhausted ? null : new Date(Date.now() + retryDelayMs(attempt)),
    deliveredAt: null,
  });

  console.warn(
    `[worker] delivery ${deliveryId} attempt ${attempt}/${maxAttempts} failed: ${result.error}`,
  );

  // Out of attempts: finish the job normally (it is already dead-lettered in Postgres).
  if (exhausted) return;

  throw new Error(result.error);
}
