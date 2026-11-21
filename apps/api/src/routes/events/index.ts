import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import { createEvent } from "./create-event.ts";

/** Registered inside the shared protected scope (see routes/index.ts), so a valid JWT is guaranteed. */
export const eventRoutes: FastifyPluginAsyncZod = async (app) => {
  app.register(createEvent);
};
