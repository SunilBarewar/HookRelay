import { and, eq } from "drizzle-orm";
import { db } from "../instance.ts";
import {
  deliveries,
  endpoints,
  endpointSubscriptions,
  events,
  type Delivery,
  type Event,
  type NewEvent,
} from "../schema/index.ts";

export type EventWithDeliveries = Event & { deliveries: Delivery[] };

/**
 * Stores an event and fans it out atomically: one pending delivery is created for every
 * active endpoint of the application that subscribes to the event type.
 * If any insert fails, nothing is written.
 */
export async function insertEvent(data: NewEvent): Promise<EventWithDeliveries> {
  return db.transaction(async (tx) => {
    const [event] = await tx.insert(events).values(data).returning();

    const targetEndpoints = await tx
      .select({ id: endpoints.id })
      .from(endpoints)
      .innerJoin(endpointSubscriptions, eq(endpointSubscriptions.endpointId, endpoints.id))
      .where(
        and(
          eq(endpoints.applicationId, event.applicationId),
          eq(endpoints.status, "active"),
          eq(endpointSubscriptions.eventType, event.eventType),
        ),
      );

    const now = new Date();
    const createdDeliveries =
      targetEndpoints.length > 0
        ? await tx
            .insert(deliveries)
            .values(
              targetEndpoints.map((endpoint) => ({
                eventId: event.id,
                endpointId: endpoint.id,
                nextAttemptAt: now,
              })),
            )
            .returning()
        : [];

    return { ...event, deliveries: createdDeliveries };
  });
}
