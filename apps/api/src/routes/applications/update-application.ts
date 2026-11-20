import { updateApplication } from "@hookrelay/db";
import { ErrorCode, HttpStatus, NotFoundError } from "@hookrelay/shared";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import { ErrorResponse } from "@/schemas/error.ts";
import {
  ApplicationResponse,
  IdParams,
  UpdateApplicationBody,
  applicationErrorResponses,
  security,
  toApplicationResponse,
} from "./applications-schemas.ts";

export const updateApplicationRoute: FastifyPluginAsyncZod = async (app) => {
  app.patch(
    "/:id",
    {
      schema: {
        tags: ["applications"],
        summary: "Rename an application",
        security,
        params: IdParams,
        body: UpdateApplicationBody,
        response: {
          [HttpStatus.OK]: ApplicationResponse,
          [HttpStatus.UNPROCESSABLE_ENTITY]: ErrorResponse,
          ...applicationErrorResponses,
        },
      },
    },
    async (request, reply) => {
      const application = await updateApplication(request.params.id, request.accountId, {
        name: request.body.name,
      });

      if (!application) {
        throw new NotFoundError("Application not found", { code: ErrorCode.NOT_FOUND });
      }

      return reply.status(HttpStatus.OK).send(toApplicationResponse(application));
    },
  );
};
