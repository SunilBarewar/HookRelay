import Fastify from "fastify";

import { Config } from "@/env.ts";
import { registerApiDocs } from "@/plugins/api-docs.ts";
import { registerErrorHandler } from "@/plugins/error-handler.ts";
import { accountRoutes } from "@/routes/accounts.ts";
import { healthRoutes } from "@/routes/health.ts";

export function buildApp() {
  const app = Fastify({ logger: { level: Config.LOG_LEVEL } });

  registerErrorHandler(app);

  // Must be registered before the routes so they show up in the docs.
  registerApiDocs(app);

  app.register(healthRoutes);
  app.register(accountRoutes, { prefix: "/accounts" });

  return app;
}
