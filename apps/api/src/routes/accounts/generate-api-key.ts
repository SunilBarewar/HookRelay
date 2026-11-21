import { setAccountApiKeyHash } from "@hookrelay/db";
import { ErrorCode, HttpStatus, NotFoundError } from "@hookrelay/shared";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import { generateApiKey } from "@/lib/api-key.ts";
import { bearerAuthSecurity } from "@/schemas/security.ts";
import { ApiKeyResponse, IdParams, protectedErrorResponses } from "./accounts-schemas.ts";

export const generateAccountApiKey: FastifyPluginAsyncZod = async (app) => {
  app.post(
    "/:id/api-key",
    {
      schema: {
        tags: ["accounts"],
        summary: "Generate or rotate the account's API key",
        description: "The key is only returned here once. Rotating invalidates the previous key.",
        security: bearerAuthSecurity,
        params: IdParams,
        response: { [HttpStatus.OK]: ApiKeyResponse, ...protectedErrorResponses },
      },
    },
    async (request) => {
      const { apiKey, apiKeyHash } = generateApiKey();

      const updated = await setAccountApiKeyHash(request.params.id, apiKeyHash);

      if (!updated) {
        throw new NotFoundError("Account not found", { code: ErrorCode.NOT_FOUND });
      }

      return { message: "Store this key now, it won't be shown again", apiKey };
    },
  );
};
