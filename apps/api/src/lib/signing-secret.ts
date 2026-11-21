import { randomBytes } from "node:crypto";

const SIGNING_SECRET_PREFIX = "whsec_";

export function generateSigningSecret(): string {
  return `${SIGNING_SECRET_PREFIX}${randomBytes(32).toString("hex")}`;
}
