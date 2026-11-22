import { findAccountById } from "@hookrelay/db";
import { ErrorCode, HttpStatus, NotFoundError } from "@hookrelay/shared";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import { protectedErrorResponses } from "@/schemas/error.ts";
import { bearerAuthSecurity } from "@/schemas/security.ts";
import { AccountResponse } from "@hookrelay/shared/schemas";
import { toAccountResponse } from "./accounts-mappers.ts";

/** The logged-in account. Lets the web app restore its session from the httpOnly cookie. */
export const getMe: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/me",
    {
      schema: {
        tags: ["accounts"],
        summary: "Get the authenticated account",
        security: bearerAuthSecurity,
        response: { [HttpStatus.OK]: AccountResponse, ...protectedErrorResponses },
      },
    },
    async (request) => {
      const account = await findAccountById(request.accountId);

      if (!account) {
        throw new NotFoundError("Account not found", { code: ErrorCode.NOT_FOUND });
      }

      return toAccountResponse(account);
    },
  );
};
