import Fastify from "fastify";

import { Config } from "./env.ts";
import { healthRoutes } from "./routes/health.ts";

export function buildApp() {
  const app = Fastify({ logger: { level: Config.LOG_LEVEL } });

  app.register(healthRoutes);

  return app;
}
