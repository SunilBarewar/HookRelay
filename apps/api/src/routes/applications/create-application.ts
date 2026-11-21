import { insertApplication } from "@hookrelay/db";
import { HttpStatus } from "@hookrelay/shared";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import { ErrorResponse, protectedErrorResponses } from "@/schemas/error.ts";
import { bearerAuthSecurity } from "@/schemas/security.ts";
import {
  ApplicationResponse,
  CreateApplicationBody,
  toApplicationResponse,
} from "./applications-schemas.ts";

export const createApplication: FastifyPluginAsyncZod = async (app) => {
  app.post(
    "/",
    {
      schema: {
        tags: ["applications"],
        summary: "Create an application",
        security: bearerAuthSecurity,
        body: CreateApplicationBody,
        response: {
          [HttpStatus.CREATED]: ApplicationResponse,
          [HttpStatus.UNPROCESSABLE_ENTITY]: ErrorResponse,
          ...protectedErrorResponses,
        },
      },
    },
    async (request, reply) => {
      const application = await insertApplication({
        accountId: request.accountId,
        name: request.body.name,
      });

      return reply.status(HttpStatus.CREATED).send(toApplicationResponse(application));
    },
  );
};
