import { pgTable, pgEnum, text, uuid, index, uniqueIndex } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { id, timestamps } from "./columns.ts";
import { applications } from "./applications.ts";

export const endpointStatus = pgEnum("endpoint_status", ["active", "disabled"]);

export const endpoints = pgTable(
  "endpoints",
  {
    id: id(),
    applicationId: uuid("application_id")
      .notNull()
      .references(() => applications.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    description: text("description"),
    status: endpointStatus("status").notNull().default("active"),
    signingSecret: text("signing_secret").notNull(),
    ...timestamps,
  },
  (table) => [index("endpoints_application_id_idx").on(table.applicationId)],
);

export const endpointSubscriptions = pgTable(
  "endpoint_subscriptions",
  {
    id: id(),
    endpointId: uuid("endpoint_id")
      .notNull()
      .references(() => endpoints.id, { onDelete: "cascade" }),
    eventType: text("event_type").notNull(),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("endpoint_subscriptions_endpoint_event_idx").on(table.endpointId, table.eventType),
  ],
);

export const applicationEndpointRelations = relations(applications, ({ many }) => ({
  endpoints: many(endpoints),
}));

export const endpointsRelations = relations(endpoints, ({ one, many }) => ({
  application: one(applications, {
    fields: [endpoints.applicationId],
    references: [applications.id],
  }),
  subscriptions: many(endpointSubscriptions),
}));

export const endpointSubscriptionsRelations = relations(endpointSubscriptions, ({ one }) => ({
  endpoint: one(endpoints, {
    fields: [endpointSubscriptions.endpointId],
    references: [endpoints.id],
  }),
}));

export type Endpoint = typeof endpoints.$inferSelect;
export type NewEndpoint = typeof endpoints.$inferInsert;
export type EndpointSubscription = typeof endpointSubscriptions.$inferSelect;
export type NewEndpointSubscription = typeof endpointSubscriptions.$inferInsert;
