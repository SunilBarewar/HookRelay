import { createHmac, timingSafeEqual } from "node:crypto";

/** How far a signed timestamp may be from "now" before verification fails (replay protection). */
export const DEFAULT_SIGNATURE_TOLERANCE_SECONDS = 5 * 60;

const HEX_SHA256 = /^[0-9a-f]{64}$/i;

export type SignWebhookParams = {
  /** The endpoint's signing secret. */
  secret: string;
  /** The exact raw request body that is sent. Signing a different serialization breaks verification. */
  data: string;
  /** Unix time in seconds (not milliseconds) at which the webhook was signed. */
  timestamp: number;
};

/** HMAC-SHA256 over `${timestamp}.${data}`, hex encoded. */
export function signWebhookPayload({ secret, data, timestamp }: SignWebhookParams): string {
  return createHmac("sha256", secret).update(`${timestamp}.${data}`).digest("hex");
}

export type VerifyWebhookParams = SignWebhookParams & {
  signature: string;
  /** Max allowed difference between `timestamp` and now, in seconds. */
  toleranceSeconds?: number;
  /** Current Unix time in seconds. Only override in tests. */
  now?: number;
};

/**
 * Checks the signature in constant time and rejects timestamps outside the
 * tolerance window, so a captured request can't be replayed later.
 */
export function verifyWebhookSignature({
  signature,
  toleranceSeconds = DEFAULT_SIGNATURE_TOLERANCE_SECONDS,
  now = Math.floor(Date.now() / 1000),
  ...params
}: VerifyWebhookParams): boolean {
  if (!Number.isFinite(params.timestamp) || Math.abs(now - params.timestamp) > toleranceSeconds) {
    return false;
  }

  if (!HEX_SHA256.test(signature)) {
    return false;
  }

  const expected = Buffer.from(signWebhookPayload(params), "hex");
  const received = Buffer.from(signature, "hex");

  return timingSafeEqual(expected, received);
}
