import { HttpStatus } from "@hookrelay/shared";
import type { FastifyReply } from "fastify";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { createAccount } from "./create-account.ts";

const notImplemented = {
  [HttpStatus.NOT_IMPLEMENTED]: z.object({ message: z.string() }),
};

const idParams = z.object({ id: z.uuid() });

// Sample routes only: handlers are stubs and respond 501 until implemented.
export const accountRoutes: FastifyPluginAsyncZod = async (app) => {
  const todo = async (_request: unknown, reply: FastifyReply): Promise<void> => {
    reply.code(HttpStatus.NOT_IMPLEMENTED).send({ message: "Not implemented" });
  };

  createAccount(app);

  app.get(
    "/:id",
    {
      schema: {
        tags: ["accounts"],
        summary: "Get an account by id",
        params: idParams,
        response: notImplemented,
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
        params: idParams,
        response: notImplemented,
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
        params: idParams,
        response: notImplemented,
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
        params: idParams,
        response: notImplemented,
      },
    },
    todo,
  );
};
