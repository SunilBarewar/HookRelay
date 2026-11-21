import type { EventWithDeliveries } from "@hookrelay/db";
import { z } from "zod";

export const ApplicationParams = z.object({ applicationId: z.uuid() });

export const CreateEventBody = z.object({
  /** e.g. "order.created". Delivered to every active endpoint subscribed to this type. */
  eventType: z.string().trim().min(1).max(255),
  /** Arbitrary JSON object, sent as-is to the subscribed endpoints. */
  payload: z.record(z.string(), z.unknown()),
});

export const DeliveryResponse = z.object({
  id: z.uuid(),
  endpointId: z.uuid(),
  status: z.enum(["pending", "success", "failed", "dead_lettered"]),
});

export const EventResponse = z.object({
  id: z.uuid(),
  applicationId: z.uuid(),
  eventType: z.string(),
  payload: z.unknown(),
  deliveries: z.array(DeliveryResponse),
  createdAt: z.iso.datetime(),
});

export function toEventResponse(event: EventWithDeliveries): z.infer<typeof EventResponse> {
  return {
    id: event.id,
    applicationId: event.applicationId,
    eventType: event.eventType,
    payload: event.payload,
    deliveries: event.deliveries.map((d) => ({
      id: d.id,
      endpointId: d.endpointId,
      status: d.status,
    })),
    createdAt: event.createdAt.toISOString(),
  };
}
