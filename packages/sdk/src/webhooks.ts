import { createHmac, timingSafeEqual } from "node:crypto";

const DEFAULT_TOLERANCE_SECONDS = 5 * 60;

export type SignatureCheck = { valid: true } | { valid: false; reason: string };

/**
 * Verifies a HookRelay delivery on the receiving side.
 *
 * Pass the RAW request body (the exact bytes received, not re-serialized JSON), the endpoint's
 * signing secret (`whsec_...`), and the `x-hookrelay-timestamp` / `x-hookrelay-signature` headers.
 */
export function verifyWebhookSignature(params: {
  secret: string;
  rawBody: string;
  timestampHeader: string | null | undefined;
  signatureHeader: string | null | undefined;
  /** Max allowed clock difference in seconds. Default 300. */
  toleranceSeconds?: number;
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

  const tolerance = params.toleranceSeconds ?? DEFAULT_TOLERANCE_SECONDS;
  const ageSeconds = Math.abs(Date.now() / 1000 - timestamp);
  if (ageSeconds > tolerance) {
    return { valid: false, reason: `timestamp is ${Math.round(ageSeconds)}s off, possible replay` };
  }

  const expected = createHmac("sha256", secret).update(`${timestampHeader}.${rawBody}`).digest();
  const received = Buffer.from(signatureHeader, "hex");

  if (received.length !== expected.length || !timingSafeEqual(expected, received)) {
    return { valid: false, reason: "signature does not match" };
  }

  return { valid: true };
}
