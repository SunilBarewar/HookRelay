import { eq } from "drizzle-orm";

import { db } from "../instance.ts";
import { accounts, type Account, type NewAccount } from "../schema/index.ts";

/** `password` must already be hashed, this package never hashes anything. */
export type InsertAccountInput = Pick<NewAccount, "email" | "password">;

/**
 * Insert a new account and return the created row.
 * Throws the Postgres unique violation (23505) if the email is taken.
 */
export async function insertAccount(input: InsertAccountInput): Promise<Account> {
  const [account] = await db.insert(accounts).values(input).returning();
  return account!;
}

export async function findAccountByEmail(email: string): Promise<Account | undefined> {
  const [account] = await db.select().from(accounts).where(eq(accounts.email, email)).limit(1);
  return account;
}

export async function findAccountById(id: string): Promise<Account | undefined> {
  const [account] = await db.select().from(accounts).where(eq(accounts.id, id)).limit(1);
  return account;
}
