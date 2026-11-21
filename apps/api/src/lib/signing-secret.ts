import { randomBytes } from "node:crypto";

const SIGNING_SECRET_PREFIX = "whsec_";

/**
 * Placeholder generator for an endpoint's HMAC signing secret.
 * The real signing / pepper logic will be added separately.
 */
export function generateSigningSecret(): string {
  return `${SIGNING_SECRET_PREFIX}${randomBytes(32).toString("base64url")}`;
}
