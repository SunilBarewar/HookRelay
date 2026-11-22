import { z } from "zod";

/**
 * Hosted deployments add stricter URL checks on the server (https only, no private hosts);
 * those depend on the environment, so the API layers them on top of this schema.
 */
export const CreateEndpointBody = z.object({
  url: z
    .url({ protocol: /^https?$/ })
    .trim()
    .max(2048),
  description: z.string().trim().max(500).optional(),
  /** Event types this endpoint wants to receive, e.g. ["order.created"]. */
  eventTypes: z.array(z.string().trim().min(1).max(255)).min(1).max(100),
});
export type CreateEndpointBody = z.infer<typeof CreateEndpointBody>;

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
export type EndpointResponse = z.infer<typeof EndpointResponse>;

/** Only returned once, when the endpoint is created. */
export const CreateEndpointResponse = EndpointResponse.extend({
  signingSecret: z.string(),
});
export type CreateEndpointResponse = z.infer<typeof CreateEndpointResponse>;
