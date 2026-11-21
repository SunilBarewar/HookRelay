import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import { accountProtectedRoutes, authRoutes } from "./accounts/index.ts";
import { applicationRoutes } from "./applications/index.ts";
import { endpointRoutes } from "./endpoints/index.ts";
import { healthRoutes } from "./health.ts";

/** Single place where every route module is registered (and given its URL prefix). */
export const registerRoutes: FastifyPluginAsyncZod = async (app) => {
  // Public routes: no token needed.
  app.register(healthRoutes);
  app.register(authRoutes, { prefix: "/auth" });

  // Protected routes: every module registered in this scope requires a valid JWT.
  app.register(
    async (protectedApp) => {
      protectedApp.addHook("onRequest", protectedApp.authenticate);

      protectedApp.register(accountProtectedRoutes, { prefix: "/accounts" });
      protectedApp.register(applicationRoutes, { prefix: "/applications" });
      protectedApp.register(endpointRoutes, { prefix: "/applications/:applicationId/endpoints" });
    },
    { prefix: "/v1" },
  );
};
