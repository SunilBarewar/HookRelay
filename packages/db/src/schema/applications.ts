import { pgTable, varchar, uuid, index } from "drizzle-orm/pg-core";
import { id, timestamps } from "./columns";
import { accounts } from "./accounts";
import { relations } from "drizzle-orm";

export const applications = pgTable(
  "applications",
  {
    id: id(),
    accountId: uuid("account_id")
      .notNull()
      .references(() => accounts.id, {
        onDelete: "cascade",
      }),
    name: varchar("name").notNull(),
    ...timestamps,
  },
  (table) => [index("applications_account_id_idx").on(table.accountId)],
);

export const accountAppRelations = relations(accounts, ({ many }) => ({
  applications: many(applications),
}));

export const applicationsRelations = relations(applications, ({ one }) => ({
  account: one(accounts, { fields: [applications.accountId], references: [accounts.id] }),
}));
