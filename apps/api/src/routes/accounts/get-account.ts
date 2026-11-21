import { findAccountById } from "@hookrelay/db";
import { ErrorCode, HttpStatus, NotFoundError } from "@hookrelay/shared";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import { bearerAuthSecurity } from "@/schemas/security.ts";
import {
  AccountResponse,
  IdParams,
  protectedErrorResponses,
  toAccountResponse,
} from "./accounts-schemas.ts";

export const getAccount: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/:id",
    {
      schema: {
        tags: ["accounts"],
        summary: "Get an account by id",
        security: bearerAuthSecurity,
        params: IdParams,
        response: { [HttpStatus.OK]: AccountResponse, ...protectedErrorResponses },
      },
    },
    async (request) => {
      const account = await findAccountById(request.params.id);

      if (!account) {
        throw new NotFoundError("Account not found", { code: ErrorCode.NOT_FOUND });
      }

      return toAccountResponse(account);
    },
  );
};
