import { createHmac, timingSafeEqual } from "node:crypto";

/** Reject timestamps further than this from "now", so a captured request can't be replayed later. */
const TOLERANCE_SECONDS = 5 * 60;

export type SignatureCheck = { valid: true } | { valid: false; reason: string };

/**
 * Verifies a HookRelay delivery. This is what a customer's server needs to do:
 *
 * 1. Take the RAW request body (the exact bytes received, not re-serialized JSON).
 * 2. Compute HMAC-SHA256 with your endpoint's signing secret (`whsec_...`) over `${timestamp}.${body}`.
 * 3. Compare it to the `x-hookrelay-signature` header in constant time.
 * 4. Reject timestamps outside a small window.
 */
export function verifySignature(params: {
  secret: string;
  rawBody: string;
  timestampHeader: string | undefined;
  signatureHeader: string | undefined;
}): SignatureCheck {
  const { secret, rawBody, timestampHeader, signatureHeader } = params;

  if (!timestampHeader || !signatureHeader) {
    return {
      valid: false,
      reason: "missing x-hookrelay-timestamp or x-hookrelay-signature header",
    };
  }

  const timestamp = Number(timestampHeader);
  if (!Number.isFinite(timestamp)) {
    return { valid: false, reason: "x-hookrelay-timestamp is not a number" };
  }

  const ageSeconds = Math.abs(Date.now() / 1000 - timestamp);
  if (ageSeconds > TOLERANCE_SECONDS) {
    return { valid: false, reason: `timestamp is ${Math.round(ageSeconds)}s off, possible replay` };
  }

  const expected = createHmac("sha256", secret).update(`${timestampHeader}.${rawBody}`).digest();
  const received = Buffer.from(signatureHeader, "hex");

  // timingSafeEqual throws on different lengths, so check that first.
  if (received.length !== expected.length || !timingSafeEqual(expected, received)) {
    return { valid: false, reason: "signature does not match" };
  }

  return { valid: true };
}
