import { deleteApplication } from "@hookrelay/db";
import { ErrorCode, HttpStatus, NotFoundError } from "@hookrelay/shared";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import { applicationErrorResponses } from "@/schemas/error.ts";
import { bearerAuthSecurity } from "@/schemas/security.ts";
import { IdParams, MessageResponse } from "./applications-schemas.ts";

export const deleteApplicationRoute: FastifyPluginAsyncZod = async (app) => {
  app.delete(
    "/:id",
    {
      schema: {
        tags: ["applications"],
        summary: "Delete an application",
        security: bearerAuthSecurity,
        params: IdParams,
        response: { [HttpStatus.OK]: MessageResponse, ...applicationErrorResponses },
      },
    },
    async (request, reply) => {
      const deleted = await deleteApplication(request.params.id, request.accountId);

      if (!deleted) {
        throw new NotFoundError("Application not found", { code: ErrorCode.NOT_FOUND });
      }

      return reply.status(HttpStatus.OK).send({ message: "Application deleted" });
    },
  );
};
