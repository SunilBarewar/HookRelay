import { eq } from "drizzle-orm";
import { db } from "../instance.ts";
import { deliveries, type Delivery } from "../schema/index.ts";

/** A delivery with everything the worker needs to send it. */
export async function getDeliveryForProcessing(deliveryId: string) {
  return db.query.deliveries.findFirst({
    where: eq(deliveries.id, deliveryId),
    with: { endpoint: true, event: true },
  });
}

export type DeliveryForProcessing = NonNullable<
  Awaited<ReturnType<typeof getDeliveryForProcessing>>
>;

export type DeliveryAttemptResult = Pick<
  Delivery,
  | "status"
  | "attempts"
  | "responseCode"
  | "responseBody"
  | "errorMessage"
  | "nextAttemptAt"
  | "deliveredAt"
>;

/** Stores the outcome of an attempt. Every field is overwritten, so a retry never keeps stale data. */
export async function recordDeliveryAttempt(
  deliveryId: string,
  result: DeliveryAttemptResult,
): Promise<void> {
  await db.update(deliveries).set(result).where(eq(deliveries.id, deliveryId));
}
