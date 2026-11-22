import type { EventWithDeliveries } from "@hookrelay/db";
import type { CreateEventResponse } from "@hookrelay/shared/schemas";

export function toCreateEventResponse(event: EventWithDeliveries): CreateEventResponse {
  return {
    id: event.id,
    deliveries: event.deliveries.map((d) => ({ id: d.id, status: d.status })),
    createdAt: event.createdAt.toISOString(),
  };
}
