import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import { createEndpoint } from "./create-endpoint.ts";

/** Registered inside the shared protected scope (see routes/index.ts), so a valid JWT is guaranteed. */
export const endpointRoutes: FastifyPluginAsyncZod = async (app) => {
  app.register(createEndpoint);
};
