import type { FastifyPluginAsync, RouteHandlerMethod } from "fastify";

const notImplemented = {
  501: {
    type: "object",
    properties: { message: { type: "string" } },
    required: ["message"],
  },
};

const idParams = {
  type: "object",
  properties: { id: { type: "string", format: "uuid" } },
  required: ["id"],
};

// Sample routes only: handlers are stubs and respond 501 until implemented.
export const accountRoutes: FastifyPluginAsync = async (app) => {
  const todo: RouteHandlerMethod = async (_request, reply) =>
    reply.code(501).send({ message: "Not implemented" });

  app.post(
    "/",
    {
      schema: {
        tags: ["accounts"],
        summary: "Create an account",
        body: {
          type: "object",
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 8 },
          },
          required: ["email", "password"],
        },
        response: notImplemented,
      },
    },
    todo,
  );

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
