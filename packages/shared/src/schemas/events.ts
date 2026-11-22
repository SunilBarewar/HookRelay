import { z } from "zod";

export const DeliveryStatus = z.enum(["pending", "success", "failed", "dead_lettered"]);
export type DeliveryStatus = z.infer<typeof DeliveryStatus>;

export const CreateEventBody = z.object({
  /** e.g. "order.created". Delivered to every active endpoint subscribed to this type. */
  eventType: z.string().trim().min(1).max(255),
  /** Arbitrary JSON object, sent as-is to the subscribed endpoints. */
  payload: z.record(z.string(), z.unknown()),
});
export type CreateEventBody = z.infer<typeof CreateEventBody>;

export const CreateEventResponse = z.object({
  id: z.uuid(),
  deliveries: z.array(z.object({ id: z.uuid(), status: DeliveryStatus })),
  createdAt: z.iso.datetime(),
});
export type CreateEventResponse = z.infer<typeof CreateEventResponse>;
