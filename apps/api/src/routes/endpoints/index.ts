import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import { createEndpoint } from "./create-endpoint.ts";
import { deleteApplicationEndpoint } from "./delete-endpoint.ts";
import { listApplicationEndpoints } from "./list-endpoints.ts";
import { updateApplicationEndpoint } from "./update-endpoint.ts";

/** Registered inside the shared protected scope (see routes/index.ts), so a valid JWT is guaranteed. */
export const endpointRoutes: FastifyPluginAsyncZod = async (app) => {
  app.register(listApplicationEndpoints);
  app.register(createEndpoint);
  app.register(updateApplicationEndpoint);
  app.register(deleteApplicationEndpoint);
};
