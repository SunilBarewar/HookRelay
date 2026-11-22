import { updateEndpoint } from "@hookrelay/db";
import { ErrorCode, HttpStatus, NotFoundError } from "@hookrelay/shared";
import { EndpointParams, EndpointResponse } from "@hookrelay/shared/schemas";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import { requireOwnedApplication } from "@/lib/require-application.ts";
import { ErrorResponse, applicationErrorResponses } from "@/schemas/error.ts";
import { bearerAuthSecurity } from "@/schemas/security.ts";
import { UpdateEndpointBody } from "./checked-bodies.ts";
import { toEndpointResponse } from "./endpoints-mappers.ts";

export const updateApplicationEndpoint: FastifyPluginAsyncZod = async (app) => {
  app.patch(
    "/:endpointId",
    {
      schema: {
        tags: ["endpoints"],
        summary: "Update an endpoint: URL, description, event types or status",
        description:
          "Send only the fields to change. `eventTypes` replaces the whole set, and a `disabled` endpoint stops receiving events.",
        security: bearerAuthSecurity,
        params: EndpointParams,
        body: UpdateEndpointBody,
        response: {
          [HttpStatus.OK]: EndpointResponse,
          [HttpStatus.UNPROCESSABLE_ENTITY]: ErrorResponse,
          ...applicationErrorResponses,
        },
      },
    },
    async (request) => {
      const { applicationId, endpointId } = request.params;
      await requireOwnedApplication(applicationId, request.accountId);

      const endpoint = await updateEndpoint(applicationId, endpointId, request.body);

      if (!endpoint) {
        throw new NotFoundError("Endpoint not found", { code: ErrorCode.NOT_FOUND });
      }

      return toEndpointResponse(endpoint);
    },
  );
};
