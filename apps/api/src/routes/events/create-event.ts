import { getApplicationById, insertEvent } from "@hookrelay/db";
import { enqueueDeliveries } from "@hookrelay/queue";
import { ErrorCode, HttpStatus, NotFoundError } from "@hookrelay/shared";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import { ErrorResponse, applicationErrorResponses } from "@/schemas/error.ts";
import { successResponse, toSuccessResponse } from "@/schemas/response.ts";
import { bearerAuthSecurity } from "@/schemas/security.ts";
import { ApplicationParams, CreateEventBody, CreateEventResponse } from "@hookrelay/shared/schemas";
import { toCreateEventResponse } from "./events-mappers.ts";

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

      if (count > 0) {
        await enqueueDeliveries(
          app.deliveryQueue,
          event.deliveries.map((delivery) => delivery.id),
        );
      }

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
