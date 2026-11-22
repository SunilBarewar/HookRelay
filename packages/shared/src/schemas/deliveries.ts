import { z } from "zod";

import { DeliveryStatus } from "./events.ts";

export const DeliveryListQuery = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(25),
  /** The `nextCursor` of the previous page. */
  cursor: z.uuid().optional(),
});
export type DeliveryListQuery = z.infer<typeof DeliveryListQuery>;

/** One event as delivered to one endpoint, with how the delivery went. */
export const DeliveryResponse = z.object({
  id: z.uuid(),
  eventId: z.uuid(),
  eventType: z.string(),
  /** What was sent: the event's JSON payload. */
  payload: z.record(z.string(), z.unknown()),
  status: DeliveryStatus,
  /** Attempts made so far. */
  attempts: z.number().int(),
  /** From the latest attempt. Null if no response was received. */
  responseCode: z.number().int().nullable(),
  /** The start of the latest response body, capped at 2,000 characters. */
  responseBody: z.string().nullable(),
  errorMessage: z.string().nullable(),
  /** When the next retry is due. Null unless a retry is scheduled. */
  nextAttemptAt: z.iso.datetime().nullable(),
  deliveredAt: z.iso.datetime().nullable(),
  eventCreatedAt: z.iso.datetime(),
});
export type DeliveryResponse = z.infer<typeof DeliveryResponse>;

export const DeliveryListResponse = z.object({
  items: z.array(DeliveryResponse),
  /** Null on the last page. */
  nextCursor: z.uuid().nullable(),
});
export type DeliveryListResponse = z.infer<typeof DeliveryListResponse>;
