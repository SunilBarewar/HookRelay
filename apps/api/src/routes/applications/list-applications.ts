import { getApplications } from "@hookrelay/db";
import { HttpStatus } from "@hookrelay/shared";
import { ApplicationListResponse } from "@hookrelay/shared/schemas";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import { protectedErrorResponses } from "@/schemas/error.ts";
import { bearerAuthSecurity } from "@/schemas/security.ts";
import { toApplicationResponse } from "./applications-mappers.ts";

export const listApplications: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/",
    {
      schema: {
        tags: ["applications"],
        summary: "List your applications, newest first",
        security: bearerAuthSecurity,
        response: { [HttpStatus.OK]: ApplicationListResponse, ...protectedErrorResponses },
      },
    },
    async (request) => {
      const applications = await getApplications(request.accountId);

      return applications.map(toApplicationResponse);
    },
  );
};
