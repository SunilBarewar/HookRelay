import { findAccountByApiKeyHash } from "@hookrelay/db";
import { ErrorCode, UnauthorizedError } from "@hookrelay/shared";
import type { FastifyInstance, FastifyRequest } from "fastify";
import fp from "fastify-plugin";

import { hashApiKey, isApiKey } from "@/lib/api-key.ts";
import { verifyAccountToken } from "@/lib/jwt.ts";

const BEARER_PREFIX = "Bearer ";

/**
 * Hashes the API key and looks up the account that owns it.
 * Throws UnauthorizedError if no account has that key.
 */
async function getAccountIdFromApiKey(apiKey: string): Promise<string> {
  const account = apiKey ? await findAccountByApiKeyHash(hashApiKey(apiKey)) : undefined;

  if (!account) {
    throw new UnauthorizedError("Invalid API key", { code: ErrorCode.UNAUTHORIZED });
  }

  return account.id;
}

/**
 * Verifies the `Authorization: Bearer <credential>` header, where the credential is either an
 * API key (`hr_...`) or a JWT, and returns the account id. Throws UnauthorizedError (-> 401 via
 * the global error handler) if the header is missing/malformed or the credential is invalid/expired.
 */
async function getAccountIdFromAuthHeader(request: FastifyRequest): Promise<string> {
  const header = request.headers.authorization;

  if (!header?.startsWith(BEARER_PREFIX)) {
    throw new UnauthorizedError("Missing or malformed Authorization header", {
      code: ErrorCode.UNAUTHORIZED,
    });
  }

  const token = header.slice(BEARER_PREFIX.length).trim();

  // `Authorization: Bearer hr_...` is an API key, anything else is treated as a JWT.
  if (isApiKey(token)) {
    return getAccountIdFromApiKey(token);
  }

  try {
    return await verifyAccountToken(token);
  } catch (cause) {
    throw new UnauthorizedError("Invalid or expired token", {
      code: ErrorCode.UNAUTHORIZED,
      cause,
    });
  }
}

declare module "fastify" {
  interface FastifyRequest {
    /** Set by `app.authenticate`; only defined on routes that run that hook. */
    accountId: string;
  }
  interface FastifyInstance {
    /** Use as a route/plugin hook: `onRequest: app.authenticate`. */
    authenticate: (request: FastifyRequest) => Promise<void>;
  }
}

// fastify-plugin disables encapsulation so the decorators are visible to sibling plugins (routes).
export const registerAuth = fp(async (app: FastifyInstance) => {
  app.decorateRequest("accountId", "");

  app.decorate("authenticate", async (request: FastifyRequest) => {
    request.accountId = await getAccountIdFromAuthHeader(request);
  });
});
