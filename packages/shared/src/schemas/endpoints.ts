import { z } from "zod";

/**
 * Hosted deployments add stricter URL checks on the server (https only, no private hosts);
 * those depend on the environment, so the API layers them on top of this schema.
 */
export const EndpointUrl = z
  .url({ protocol: /^https?$/ })
  .trim()
  .max(2048);

export const EndpointDescription = z.string().trim().max(500);

/** Event types an endpoint wants to receive, e.g. ["order.created"]. */
export const EndpointEventTypes = z.array(z.string().trim().min(1).max(255)).min(1).max(100);

export const EndpointStatus = z.enum(["active", "disabled"]);
export type EndpointStatus = z.infer<typeof EndpointStatus>;

export const EndpointParams = z.object({ applicationId: z.uuid(), endpointId: z.uuid() });
export type EndpointParams = z.infer<typeof EndpointParams>;

export const CreateEndpointBody = z.object({
  url: EndpointUrl,
  description: EndpointDescription.optional(),
  eventTypes: EndpointEventTypes,
});
export type CreateEndpointBody = z.infer<typeof CreateEndpointBody>;

/** Send only what changes. `description: null` clears it; `eventTypes` replaces the whole set. */
export const UpdateEndpointBody = z
  .object({
    url: EndpointUrl.optional(),
    description: EndpointDescription.nullable().optional(),
    status: EndpointStatus.optional(),
    eventTypes: EndpointEventTypes.optional(),
  })
  .refine((body) => Object.values(body).some((value) => value !== undefined), {
    message: "Provide at least one field to change",
  });
export type UpdateEndpointBody = z.infer<typeof UpdateEndpointBody>;

export const EndpointResponse = z.object({
  id: z.uuid(),
  applicationId: z.uuid(),
  url: z.string(),
  description: z.string().nullable(),
  status: EndpointStatus,
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

export const EndpointListResponse = z.array(EndpointResponse);
export type EndpointListResponse = z.infer<typeof EndpointListResponse>;
