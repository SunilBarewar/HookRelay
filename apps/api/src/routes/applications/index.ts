import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { createApplication } from "./create-application";

export const applicationRoutes: FastifyPluginAsyncZod = async (app) => {
  app.register(createApplication);
};
