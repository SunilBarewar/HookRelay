import { getApplicationById, insertEndpoint } from "@hookrelay/db";
import { ErrorCode, HttpStatus, NotFoundError } from "@hookrelay/shared";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import { generateSigningSecret } from "@/lib/signing-secret.ts";
import { ErrorResponse } from "@/schemas/error.ts";
import { bearerAuthSecurity } from "@/schemas/security.ts";
import {
  ApplicationParams,
  CreateEndpointBody,
  CreateEndpointResponse,
  applicationErrorResponses,
  toEndpointResponse,
} from "./endpoints-schemas.ts";

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
      const application = await getApplicationById(request.params.applicationId);

      // Same 404 for "missing" and "someone else's" so ids can't be probed.
      if (!application || application.accountId !== request.accountId) {
        throw new NotFoundError("Application not found", { code: ErrorCode.NOT_FOUND });
      }

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
