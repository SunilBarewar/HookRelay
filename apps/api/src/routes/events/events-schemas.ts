import type { EventWithDeliveries } from "@hookrelay/db";
import { z } from "zod";

export const ApplicationParams = z.object({ applicationId: z.uuid() });

export const CreateEventBody = z.object({
  /** e.g. "order.created". Delivered to every active endpoint subscribed to this type. */
  eventType: z.string().trim().min(1).max(255),
  /** Arbitrary JSON object, sent as-is to the subscribed endpoints. */
  payload: z.record(z.string(), z.unknown()),
});

export const CreateEventResponse = z.object({
  id: z.uuid(),
  deliveries: z.array(
    z.object({
      id: z.uuid(),
      status: z.enum(["pending", "success", "failed", "dead_lettered"]),
    }),
  ),
  createdAt: z.iso.datetime(),
});

export function toCreateEventResponse(
  event: EventWithDeliveries,
): z.infer<typeof CreateEventResponse> {
  return {
    id: event.id,
    deliveries: event.deliveries.map((d) => ({ id: d.id, status: d.status })),
    createdAt: event.createdAt.toISOString(),
  };
}
