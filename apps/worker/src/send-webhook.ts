import { isProduction, signWebhookPayload } from "@hookrelay/shared";
import { fetch } from "undici";

import { getBlockedUrlError, guardedAgent } from "./ssrf-guard.ts";

export const REQUEST_TIMEOUT_MS = 10_000;
const MAX_RESPONSE_BODY_CHARS = 2_000;

export type WebhookRequest = {
  url: string;
  signingSecret: string;
  deliveryId: string;
  eventId: string;
  eventType: string;
  eventCreatedAt: Date;
  data: unknown;
};

export type WebhookResult =
  | { ok: true; statusCode: number; body: string }
  | { ok: false; statusCode: number | null; body: string | null; error: string };

/** Sends one signed webhook. Never throws: every outcome is returned as a result. */
export async function sendWebhook(request: WebhookRequest): Promise<WebhookResult> {
  // The signature covers this exact string, so it is also what we send.
  const body = JSON.stringify({
    id: request.eventId,
    type: request.eventType,
    createdAt: request.eventCreatedAt.toISOString(),
    data: request.data,
  });
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = signWebhookPayload({ secret: request.signingSecret, data: body, timestamp });

  if (isProduction()) {
    const blocked = getBlockedUrlError(request.url);
    if (blocked) return { ok: false, statusCode: null, body: null, error: blocked };
  }

  try {
    const response = await fetch(request.url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "user-agent": "HookRelay/1.0",
        "x-hookrelay-event-id": request.eventId,
        "x-hookrelay-timestamp": String(timestamp),
        "x-hookrelay-signature": signature,
      },
      body,
      // Never follow redirects: a 3xx could bounce us to an internal address.
      redirect: "manual",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      dispatcher: isProduction() ? guardedAgent : undefined,
    });

    const responseBody = (await response.text()).slice(0, MAX_RESPONSE_BODY_CHARS);

    if (response.status >= 200 && response.status < 300) {
      return { ok: true, statusCode: response.status, body: responseBody };
    }

    return {
      ok: false,
      statusCode: response.status,
      body: responseBody,
      error: `Endpoint responded with HTTP ${response.status}`,
    };
  } catch (error) {
    return { ok: false, statusCode: null, body: null, error: describeError(error) };
  }
}

function describeError(error: unknown): string {
  if (error instanceof Error && error.name === "TimeoutError") {
    return `Request timed out after ${REQUEST_TIMEOUT_MS}ms`;
  }

  if (error instanceof Error) {
    // undici wraps the real reason (ECONNREFUSED, our private-address error, ...) in `cause`.
    const cause = error.cause instanceof Error ? `: ${error.cause.message}` : "";
    return `${error.message}${cause}`;
  }

  return "Unknown error";
}
