import { and, desc, eq, inArray, notInArray } from "drizzle-orm";

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

/** Attaches each endpoint's subscriptions, in one extra query instead of one per endpoint. */
async function withSubscriptions(rows: Endpoint[]): Promise<EndpointWithSubscriptions[]> {
  if (rows.length === 0) return [];

  const subscriptions = await db
    .select()
    .from(endpointSubscriptions)
    .where(
      inArray(
        endpointSubscriptions.endpointId,
        rows.map((row) => row.id),
      ),
    );

  return rows.map((row) => ({
    ...row,
    subscriptions: subscriptions.filter((subscription) => subscription.endpointId === row.id),
  }));
}

/** An application's endpoints, newest first. */
export async function listEndpoints(applicationId: string): Promise<EndpointWithSubscriptions[]> {
  const rows = await db
    .select()
    .from(endpoints)
    .where(eq(endpoints.applicationId, applicationId))
    .orderBy(desc(endpoints.createdAt));

  return withSubscriptions(rows);
}

export type EndpointChanges = {
  url?: string;
  /** `null` clears the description. */
  description?: string | null;
  status?: Endpoint["status"];
  /** The full set of event types the endpoint should be subscribed to. */
  eventTypes?: string[];
};

/**
 * Updates an endpoint that belongs to the application, and makes its subscriptions match
 * `eventTypes` when given. Existing subscriptions that are kept aren't rewritten.
 * Returns undefined when the endpoint isn't in that application.
 */
export async function updateEndpoint(
  applicationId: string,
  endpointId: string,
  changes: EndpointChanges,
): Promise<EndpointWithSubscriptions | undefined> {
  return db.transaction(async (tx) => {
    const { eventTypes, ...columns } = changes;
    const scope = and(eq(endpoints.id, endpointId), eq(endpoints.applicationId, applicationId));

    // Always updates, so `updatedAt` also moves when only the subscriptions change.
    const [endpoint] = await tx
      .update(endpoints)
      .set({ ...columns, updatedAt: new Date() })
      .where(scope)
      .returning();

    if (!endpoint) return undefined;

    if (eventTypes) {
      const wanted = [...new Set(eventTypes)];

      await tx
        .delete(endpointSubscriptions)
        .where(
          and(
            eq(endpointSubscriptions.endpointId, endpointId),
            wanted.length > 0 ? notInArray(endpointSubscriptions.eventType, wanted) : undefined,
          ),
        );

      if (wanted.length > 0) {
        await tx
          .insert(endpointSubscriptions)
          .values(wanted.map((eventType) => ({ endpointId, eventType })))
          .onConflictDoNothing();
      }
    }

    const subscriptions = await tx
      .select()
      .from(endpointSubscriptions)
      .where(eq(endpointSubscriptions.endpointId, endpointId));

    return { ...endpoint, subscriptions };
  });
}

/** Deletes an endpoint that belongs to the application. Returns false if it isn't there. */
export async function deleteEndpoint(applicationId: string, endpointId: string): Promise<boolean> {
  const deleted = await db
    .delete(endpoints)
    .where(and(eq(endpoints.id, endpointId), eq(endpoints.applicationId, applicationId)))
    .returning({ id: endpoints.id });

  return deleted.length > 0;
}
