import { getEndpointInApplication, listEndpointDeliveries } from "@hookrelay/db";
import { ErrorCode, HttpStatus, NotFoundError } from "@hookrelay/shared";
import { DeliveryListQuery, DeliveryListResponse, EndpointParams } from "@hookrelay/shared/schemas";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import { requireOwnedApplication } from "@/lib/require-application.ts";
import { applicationErrorResponses } from "@/schemas/error.ts";
import { bearerAuthSecurity } from "@/schemas/security.ts";
import { toDeliveryResponse } from "./endpoints-mappers.ts";

export const listEndpointDeliveriesRoute: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/:endpointId/deliveries",
    {
      schema: {
        tags: ["endpoints"],
        summary: "List the events delivered to an endpoint, newest first",
        description:
          "Each item is one event as sent to this endpoint, with the outcome of its latest attempt. Pass the previous page's `nextCursor` as `cursor` to get older ones.",
        security: bearerAuthSecurity,
        params: EndpointParams,
        querystring: DeliveryListQuery,
        response: { [HttpStatus.OK]: DeliveryListResponse, ...applicationErrorResponses },
      },
    },
    async (request) => {
      const { applicationId, endpointId } = request.params;
      await requireOwnedApplication(applicationId, request.accountId);

      if (!(await getEndpointInApplication(applicationId, endpointId))) {
        throw new NotFoundError("Endpoint not found", { code: ErrorCode.NOT_FOUND });
      }

      const page = await listEndpointDeliveries(endpointId, request.query);

      return { items: page.items.map(toDeliveryResponse), nextCursor: page.nextCursor };
    },
  );
};
