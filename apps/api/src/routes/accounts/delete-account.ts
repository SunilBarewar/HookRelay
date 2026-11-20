import { deleteAccount } from "@hookrelay/db";
import { ErrorCode, HttpStatus, NotFoundError } from "@hookrelay/shared";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import {
  IdParams,
  MessageResponse,
  protectedErrorResponses,
  security,
} from "./accounts-schemas.ts";

export const deleteAccountRoute: FastifyPluginAsyncZod = async (app) => {
  app.delete(
    "/:id",
    {
      schema: {
        tags: ["accounts"],
        summary: "Delete an account",
        security,
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
