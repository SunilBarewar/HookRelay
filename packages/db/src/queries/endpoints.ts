import { db } from "../instance.ts";
import {
  endpoints,
  endpointSubscriptions,
  type Endpoint,
  type EndpointSubscription,
  type NewEndpoint,
} from "../schema/index.ts";

export type EndpointWithSubscriptions = Endpoint & { subscriptions: EndpointSubscription[] };

/**
 * Registers an endpoint and its event subscriptions atomically:
 * if either insert fails, nothing is written.
 */
export async function insertEndpoint(
  data: NewEndpoint,
  eventTypes: string[],
): Promise<EndpointWithSubscriptions> {
  return db.transaction(async (tx) => {
    const [endpoint] = await tx.insert(endpoints).values(data).returning();

    const uniqueEventTypes = [...new Set(eventTypes)];
    const subscriptions =
      uniqueEventTypes.length > 0
        ? await tx
            .insert(endpointSubscriptions)
            .values(uniqueEventTypes.map((eventType) => ({ endpointId: endpoint.id, eventType })))
            .returning()
        : [];

    return { ...endpoint, subscriptions };
  });
}
