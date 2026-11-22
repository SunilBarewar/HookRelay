import { insertEndpoint } from "@hookrelay/db";
import { HttpStatus } from "@hookrelay/shared";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import { requireOwnedApplication } from "@/lib/require-application.ts";
import { generateSigningSecret } from "@/lib/signing-secret.ts";
import { ErrorResponse, applicationErrorResponses } from "@/schemas/error.ts";
import { bearerAuthSecurity } from "@/schemas/security.ts";
import { ApplicationParams, CreateEndpointResponse } from "@hookrelay/shared/schemas";
import { CreateEndpointBody } from "./checked-bodies.ts";
import { toEndpointResponse } from "./endpoints-mappers.ts";

export const createEndpoint: FastifyPluginAsyncZod = async (app) => {
  app.post(
    "/",
    {
      schema: {
        tags: ["endpoints"],
        summary: "Create an endpoint for an application",
        security: bearerAuthSecurity,
        params: ApplicationParams,
        body: CreateEndpointBody,
        response: {
          [HttpStatus.CREATED]: CreateEndpointResponse,
          [HttpStatus.UNPROCESSABLE_ENTITY]: ErrorResponse,
          ...applicationErrorResponses,
        },
      },
    },
    async (request, reply) => {
      const application = await requireOwnedApplication(
        request.params.applicationId,
        request.accountId,
      );

      const signingSecret = generateSigningSecret();

      const endpoint = await insertEndpoint(
        {
          applicationId: application.id,
          url: request.body.url,
          description: request.body.description,
          signingSecret,
        },
        request.body.eventTypes,
      );

      return reply
        .status(HttpStatus.CREATED)
        .send({ ...toEndpointResponse(endpoint), signingSecret });
    },
  );
};
