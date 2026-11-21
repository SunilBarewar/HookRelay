import type { EndpointWithSubscriptions } from "@hookrelay/db";
import { z } from "zod";

import { getEndpointUrlError } from "@/lib/endpoint-url.ts";

export const ApplicationParams = z.object({ applicationId: z.uuid() });

export const CreateEndpointBody = z.object({
  url: z
    .url({ protocol: /^https?$/ })
    .trim()
    .max(2048)
    .superRefine((value, ctx) => {
      const message = getEndpointUrlError(value);
      if (message) ctx.addIssue({ code: "custom", message });
    }),
  description: z.string().trim().max(500).optional(),
  /** Event types this endpoint wants to receive, e.g. ["order.created"]. */
  eventTypes: z.array(z.string().trim().min(1).max(255)).min(1).max(100),
});

export const EndpointResponse = z.object({
  id: z.uuid(),
  applicationId: z.uuid(),
  url: z.string(),
  description: z.string().nullable(),
  status: z.enum(["active", "disabled"]),
  eventTypes: z.array(z.string()),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

/** Only returned once, when the endpoint is created. */
export const CreateEndpointResponse = EndpointResponse.extend({
  signingSecret: z.string(),
});

export function toEndpointResponse(
  endpoint: EndpointWithSubscriptions,
): z.infer<typeof EndpointResponse> {
  return {
    id: endpoint.id,
    applicationId: endpoint.applicationId,
    url: endpoint.url,
    description: endpoint.description,
    status: endpoint.status,
    eventTypes: endpoint.subscriptions.map((s) => s.eventType),
    createdAt: endpoint.createdAt.toISOString(),
    updatedAt: endpoint.updatedAt.toISOString(),
  };
}
