import { createHash, randomBytes } from "node:crypto";

const API_KEY_PREFIX = "hr_";

export function hashApiKey(apiKey: string): string {
  return createHash("sha256").update(apiKey).digest("hex");
}

export function generateApiKey(): { apiKey: string; apiKeyHash: string } {
  const apiKey = `${API_KEY_PREFIX}${randomBytes(32).toString("base64url")}`;
  return { apiKey, apiKeyHash: hashApiKey(apiKey) };
}
