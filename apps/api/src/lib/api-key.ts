import { createHash, randomBytes } from "node:crypto";

const API_KEY_PREFIX = "hr_";

/** JWTs never start with this, so it tells the two Bearer credential types apart. */
export function isApiKey(token: string): boolean {
  return token.startsWith(API_KEY_PREFIX);
}

export function hashApiKey(apiKey: string): string {
  return createHash("sha256").update(apiKey).digest("hex");
}

export function generateApiKey(): { apiKey: string; apiKeyHash: string } {
  const apiKey = `${API_KEY_PREFIX}${randomBytes(32).toString("base64url")}`;
  return { apiKey, apiKeyHash: hashApiKey(apiKey) };
}
