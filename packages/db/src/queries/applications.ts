import { eq } from "drizzle-orm";
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

export async function getApplications(accountId: string) {
  return db.select().from(applications).where(eq(applications.accountId, accountId));
}
