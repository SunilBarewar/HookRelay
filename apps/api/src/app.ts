import Fastify from "fastify";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";

import { Config } from "@/env.ts";
import { registerApiDocs } from "@/plugins/api-docs.ts";
import { registerErrorHandler } from "@/plugins/error-handler.ts";
import { accountRoutes } from "@/routes/accounts/index.ts";
import { healthRoutes } from "@/routes/health.ts";

export function buildApp() {
  const app = Fastify({ logger: { level: Config.LOG_LEVEL } });

  // Zod schemas on routes drive validation, serialization and the OpenAPI docs.
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  registerErrorHandler(app);

  // Must be registered before the routes so they show up in the docs.
  registerApiDocs(app);

  app.register(healthRoutes);
  app.register(accountRoutes, { prefix: "/accounts" });

  return app;
}
