import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import { createApplication } from "./create-application.ts";
import { deleteApplicationRoute } from "./delete-application.ts";
import { updateApplicationRoute } from "./update-application.ts";

/** Registered inside the shared protected scope (see routes/index.ts), so a valid JWT is guaranteed. */
export const applicationRoutes: FastifyPluginAsyncZod = async (app) => {
  app.register(createApplication);
  app.register(updateApplicationRoute);
  app.register(deleteApplicationRoute);
};
