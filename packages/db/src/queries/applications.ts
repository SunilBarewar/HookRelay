import { and, desc, eq } from "drizzle-orm";
import { db } from "../instance.ts";
import { applications, type Application, type NewApplication } from "../schema/index.ts";

export async function insertApplication(data: NewApplication): Promise<Application> {
  const [app] = await db.insert(applications).values(data).returning();
  return app;
}

export async function getApplicationById(appId: string) {
  const res = await db.select().from(applications).where(eq(applications.id, appId));
  return res[0] ?? null;
}

/** The account's applications, newest first. */
export async function getApplications(accountId: string): Promise<Application[]> {
  return db
    .select()
    .from(applications)
    .where(eq(applications.accountId, accountId))
    .orderBy(desc(applications.createdAt));
}

export async function updateApplication(
  appId: string,
  accountId: string,
  input: { name: string },
): Promise<Application | undefined> {
  const [application] = await db
    .update(applications)
    .set(input)
    .where(and(eq(applications.id, appId), eq(applications.accountId, accountId)))
    .returning();
  return application;
}

export async function deleteApplication(id: string, accountId: string): Promise<boolean> {
  const deleted = await db
    .delete(applications)
    .where(and(eq(applications.id, id), eq(applications.accountId, accountId)))
    .returning({ id: applications.id });
  return deleted.length > 0;
}
