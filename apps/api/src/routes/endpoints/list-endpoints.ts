import { listEndpoints } from "@hookrelay/db";
import { HttpStatus } from "@hookrelay/shared";
import { ApplicationParams, EndpointListResponse } from "@hookrelay/shared/schemas";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import { requireOwnedApplication } from "@/lib/require-application.ts";
import { applicationErrorResponses } from "@/schemas/error.ts";
import { bearerAuthSecurity } from "@/schemas/security.ts";
import { toEndpointResponse } from "./endpoints-mappers.ts";

export const listApplicationEndpoints: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/",
    {
      schema: {
        tags: ["endpoints"],
        summary: "List an application's endpoints, newest first",
        security: bearerAuthSecurity,
        params: ApplicationParams,
        response: { [HttpStatus.OK]: EndpointListResponse, ...applicationErrorResponses },
      },
    },
    async (request) => {
      const application = await requireOwnedApplication(
        request.params.applicationId,
        request.accountId,
      );

      const endpoints = await listEndpoints(application.id);

      return endpoints.map(toEndpointResponse);
    },
  );
};
