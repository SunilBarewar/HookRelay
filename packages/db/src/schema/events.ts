import { pgTable, text, uuid, jsonb, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { id, timestamps } from "./columns.ts";
import { applications } from "./applications.ts";

export const events = pgTable(
  "events",
  {
    id: id(),
    applicationId: uuid("application_id")
      .notNull()
      .references(() => applications.id, { onDelete: "cascade" }),
    eventType: text("event_type").notNull(),
    payload: jsonb("payload").notNull(),
    ...timestamps,
  },
  (table) => [
    index("events_application_id_idx").on(table.applicationId),
    index("events_application_id_created_at_idx").on(table.applicationId, table.createdAt),
  ],
);

export const applicationEventRelations = relations(applications, ({ many }) => ({
  events: many(events),
}));

export const eventsRelations = relations(events, ({ one }) => ({
  application: one(applications, {
    fields: [events.applicationId],
    references: [applications.id],
  }),
}));

export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
