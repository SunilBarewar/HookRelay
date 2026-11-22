import { and, desc, eq, lt } from "drizzle-orm";
import { db } from "../instance.ts";
import { deliveries, events, type Delivery } from "../schema/index.ts";

/** A delivery with everything the worker needs to send it. */
export async function getDeliveryForProcessing(deliveryId: string) {
  return db.query.deliveries.findFirst({
    where: eq(deliveries.id, deliveryId),
    with: { endpoint: true, event: true },
  });
}

export type DeliveryForProcessing = NonNullable<
  Awaited<ReturnType<typeof getDeliveryForProcessing>>
>;

export type DeliveryAttemptResult = Pick<
  Delivery,
  | "status"
  | "attempts"
  | "responseCode"
  | "responseBody"
  | "errorMessage"
  | "nextAttemptAt"
  | "deliveredAt"
>;

/** Stores the outcome of an attempt. Every field is overwritten, so a retry never keeps stale data. */
export async function recordDeliveryAttempt(
  deliveryId: string,
  result: DeliveryAttemptResult,
): Promise<void> {
  await db.update(deliveries).set(result).where(eq(deliveries.id, deliveryId));
}

export type EndpointDelivery = Delivery & {
  eventType: string;
  payload: unknown;
  eventCreatedAt: Date;
};

export type EndpointDeliveryPage = {
  items: EndpointDelivery[];
  /** Pass as `cursor` to get the next, older page. Null on the last page. */
  nextCursor: string | null;
};

/**
 * The deliveries sent to an endpoint, newest first, each with the event it carried.
 * Ids are time-ordered UUIDv7s, so ordering and paging by id is ordering and paging by time.
 */
export async function listEndpointDeliveries(
  endpointId: string,
  options: { limit: number; cursor?: string },
): Promise<EndpointDeliveryPage> {
  const rows = await db
    .select({
      delivery: deliveries,
      eventType: events.eventType,
      payload: events.payload,
      eventCreatedAt: events.createdAt,
    })
    .from(deliveries)
    .innerJoin(events, eq(deliveries.eventId, events.id))
    .where(
      and(
        eq(deliveries.endpointId, endpointId),
        options.cursor ? lt(deliveries.id, options.cursor) : undefined,
      ),
    )
    .orderBy(desc(deliveries.id))
    // One extra row tells us whether another page exists.
    .limit(options.limit + 1);

  const page = rows.slice(0, options.limit);

  return {
    items: page.map(({ delivery, ...event }) => ({ ...delivery, ...event })),
    nextCursor: rows.length > options.limit ? (page.at(-1)?.delivery.id ?? null) : null,
  };
}
