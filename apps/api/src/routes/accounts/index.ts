import { ErrorCode, ForbiddenError, HttpStatus } from "@hookrelay/shared";
import type { FastifyReply } from "fastify";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

import { ErrorResponse } from "@/schemas/error.ts";
import { createAccount } from "./create-account.ts";
import { login } from "./login.ts";

const protectedResponses = {
  [HttpStatus.UNAUTHORIZED]: ErrorResponse,
  [HttpStatus.FORBIDDEN]: ErrorResponse,
  [HttpStatus.NOT_IMPLEMENTED]: z.object({ message: z.string() }),
};

// Shown as a lock icon / "Authorize" box in the OpenAPI docs.
const security = [{ bearerAuth: [] }];

const idParams = z.object({ id: z.uuid() });

const todo = async (_request: unknown, reply: FastifyReply): Promise<void> => {
  reply.code(HttpStatus.NOT_IMPLEMENTED).send({ message: "Not implemented" });
};

/** Signup and login: no token needed. */
export const accountPublicRoutes: FastifyPluginAsyncZod = async (app) => {
  createAccount(app);
  login(app);
};

/**
 * Routes on a specific account. Registered inside the shared protected scope
 * (see routes/index.ts), so a valid JWT is already guaranteed here.
 * Sample routes only: handlers are stubs and respond 501 until implemented.
 */
export const accountProtectedRoutes: FastifyPluginAsyncZod = async (app) => {
  // Authorization: an account may only act on itself. Runs after params validation.
  app.addHook("preHandler", async (request) => {
    const { id } = request.params as { id: string };
    if (id !== request.accountId) {
      throw new ForbiddenError("You can only access your own account", {
        code: ErrorCode.FORBIDDEN,
      });
    }
  });

  app.get(
    "/:id",
    {
      schema: {
        tags: ["accounts"],
        summary: "Get an account by id",
        security,
        params: idParams,
        response: protectedResponses,
      },
    },
    todo,
  );

  app.patch(
    "/:id",
    {
      schema: {
        tags: ["accounts"],
        summary: "Update an account",
        security,
        params: idParams,
        response: protectedResponses,
      },
    },
    todo,
  );

  app.delete(
    "/:id",
    {
      schema: {
        tags: ["accounts"],
        summary: "Delete an account",
        security,
        params: idParams,
        response: protectedResponses,
      },
    },
    todo,
  );

  app.post(
    "/:id/api-key",
    {
      schema: {
        tags: ["accounts"],
        summary: "Generate or rotate the account's API key",
        security,
        params: idParams,
        response: protectedResponses,
      },
    },
    todo,
  );
};
