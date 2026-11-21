import { pgTable, pgEnum, uuid, integer, text, timestamp, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { id } from "./columns.ts";
import { events } from "./events.ts";
import { endpoints } from "./endpoints.ts";

export const deliveryStatus = pgEnum("delivery_status", [
  "pending",
  "success",
  "failed",
  "dead_lettered",
]);

export const deliveries = pgTable(
  "deliveries",
  {
    id: id(),
    eventId: uuid("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    endpointId: uuid("endpoint_id")
      .notNull()
      .references(() => endpoints.id, { onDelete: "cascade" }),
    status: deliveryStatus("status").notNull().default("pending"),
    attempts: integer("attempts").notNull().default(0),
    responseCode: integer("response_code"),
    responseBody: text("response_body"),
    errorMessage: text("error_message"),
    nextAttemptAt: timestamp("next_attempt_at", { withTimezone: true }),
    deliveredAt: timestamp("delivered_at", { withTimezone: true }),
  },
  (table) => [
    index("deliveries_event_id_idx").on(table.eventId),
    index("deliveries_endpoint_id_idx").on(table.endpointId),
    index("deliveries_status_next_attempt_at_idx").on(table.status, table.nextAttemptAt),
  ],
);

export const eventDeliveryRelations = relations(events, ({ many }) => ({
  deliveries: many(deliveries),
}));

export const endpointDeliveryRelations = relations(endpoints, ({ many }) => ({
  deliveries: many(deliveries),
}));

export const deliveriesRelations = relations(deliveries, ({ one }) => ({
  event: one(events, { fields: [deliveries.eventId], references: [events.id] }),
  endpoint: one(endpoints, { fields: [deliveries.endpointId], references: [endpoints.id] }),
}));

export type Delivery = typeof deliveries.$inferSelect;
export type NewDelivery = typeof deliveries.$inferInsert;
