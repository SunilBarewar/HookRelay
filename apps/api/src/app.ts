import Fastify from "fastify";

import { Config } from "./env.ts";
import { registerApiDocs } from "./plugins/api-docs.ts";
import { accountRoutes } from "./routes/accounts.ts";
import { healthRoutes } from "./routes/health.ts";

export async function buildApp() {
  const app = Fastify({ logger: { level: Config.LOG_LEVEL } });

  // Must be registered before the routes so they show up in the docs.
  await registerApiDocs(app);

  await app.register(healthRoutes);
  await app.register(accountRoutes, { prefix: "/accounts" });

  return app;
}
