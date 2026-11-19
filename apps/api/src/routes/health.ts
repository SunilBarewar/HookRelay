import { db, sql } from "@hookrelay/db";
import type { FastifyPluginAsync } from "fastify";

export const healthRoutes: FastifyPluginAsync = async (app) => {
  app.get("/health", async () => ({ status: "ok" }));

  app.get("/health/db", async (_request, reply) => {
    try {
      await db.execute(sql`select 1`);
      return { status: "ok" };
    } catch (error) {
      app.log.error(error, "database health check failed");
      return reply.code(503).send({ status: "unavailable" });
    }
  });
};
