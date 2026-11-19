import { db, sql } from "@hookrelay/db";
import type { FastifyPluginAsync } from "fastify";

const statusResponse = (status: string) => ({
  type: "object",
  properties: { status: { type: "string", enum: [status] } },
  required: ["status"],
});

export const healthRoutes: FastifyPluginAsync = async (app) => {
  app.get(
    "/health",
    {
      schema: {
        tags: ["health"],
        summary: "Liveness check",
        response: { 200: statusResponse("ok") },
      },
    },
    async () => ({ status: "ok" }),
  );

  app.get(
    "/health/db",
    {
      schema: {
        tags: ["health"],
        summary: "Database connectivity check",
        response: { 200: statusResponse("ok"), 503: statusResponse("unavailable") },
      },
    },
    async (_request, reply) => {
      try {
        await db.execute(sql`select 1`);
        return { status: "ok" };
      } catch (error) {
        app.log.error(error, "database health check failed");
        return reply.code(503).send({ status: "unavailable" });
      }
    },
  );
};
