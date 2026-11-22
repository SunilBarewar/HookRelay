import { deleteEndpoint } from "@hookrelay/db";
import { ErrorCode, HttpStatus, NotFoundError } from "@hookrelay/shared";
import { EndpointParams, MessageResponse } from "@hookrelay/shared/schemas";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import { requireOwnedApplication } from "@/lib/require-application";
import { applicationErrorResponses } from "@/schemas/error.ts";
import { bearerAuthSecurity } from "@/schemas/security.ts";

export const deleteApplicationEndpoint: FastifyPluginAsyncZod = async (app) => {
  app.delete(
    "/:endpointId",
    {
      schema: {
        tags: ["endpoints"],
        summary: "Delete an endpoint",
        description: "Also deletes the endpoint's subscriptions and delivery history.",
        security: bearerAuthSecurity,
        params: EndpointParams,
        response: { [HttpStatus.OK]: MessageResponse, ...applicationErrorResponses },
      },
    },
    async (request) => {
      const { applicationId, endpointId } = request.params;
      await requireOwnedApplication(applicationId, request.accountId);

      if (!(await deleteEndpoint(applicationId, endpointId))) {
        throw new NotFoundError("Endpoint not found", { code: ErrorCode.NOT_FOUND });
      }

      return { message: "Endpoint deleted" };
    },
  );
};
