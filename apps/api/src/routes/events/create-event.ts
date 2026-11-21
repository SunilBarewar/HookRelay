import { getApplicationById, insertEvent } from "@hookrelay/db";
import { ErrorCode, HttpStatus, NotFoundError } from "@hookrelay/shared";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import { ErrorResponse, applicationErrorResponses } from "@/schemas/error.ts";
import { successResponse, toSuccessResponse } from "@/schemas/response.ts";
import { bearerAuthSecurity } from "@/schemas/security.ts";
import {
  ApplicationParams,
  CreateEventBody,
  CreateEventResponse,
  toCreateEventResponse,
} from "./events-schemas.ts";

export const createEvent: FastifyPluginAsyncZod = async (app) => {
  app.post(
    "/",
    {
      schema: {
        tags: ["events"],
        summary: "Create an event",
        security: bearerAuthSecurity,
        params: ApplicationParams,
        body: CreateEventBody,
        response: {
          [HttpStatus.CREATED]: successResponse(CreateEventResponse),
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

      const event = await insertEvent({
        applicationId: application.id,
        eventType: request.body.eventType,
        payload: request.body.payload,
      });

      const count = event.deliveries.length;
      const message =
        count === 0
          ? "Event created, no endpoints subscribed to this event type"
          : `Event created, ${count} ${count === 1 ? "delivery" : "deliveries"} queued`;

      return reply
        .status(HttpStatus.CREATED)
        .send(toSuccessResponse(message, toCreateEventResponse(event)));
    },
  );
};
