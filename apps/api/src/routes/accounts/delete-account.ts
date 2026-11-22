import { deleteAccount } from "@hookrelay/db";
import { ErrorCode, HttpStatus, NotFoundError } from "@hookrelay/shared";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import { protectedErrorResponses } from "@/schemas/error.ts";
import { bearerAuthSecurity } from "@/schemas/security.ts";
import { IdParams, MessageResponse } from "@hookrelay/shared/schemas";

export const deleteAccountRoute: FastifyPluginAsyncZod = async (app) => {
  app.delete(
    "/:id",
    {
      schema: {
        tags: ["accounts"],
        summary: "Delete an account",
        security: bearerAuthSecurity,
        params: IdParams,
        response: { [HttpStatus.OK]: MessageResponse, ...protectedErrorResponses },
      },
    },
    async (request) => {
      const deleted = await deleteAccount(request.params.id);

      if (!deleted) {
        throw new NotFoundError("Account not found", { code: ErrorCode.NOT_FOUND });
      }

      return { message: "Account deleted" };
    },
  );
};
