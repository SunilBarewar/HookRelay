import swagger from "@fastify/swagger";
import scalar from "@scalar/fastify-api-reference";
import type { FastifyInstance } from "fastify";

/**
 * @fastify/swagger generates the OpenAPI spec from the route schemas,
 * Scalar renders it at /docs. Register before the routes.
 */
export async function registerApiDocs(app: FastifyInstance) {
  await app.register(swagger, {
    openapi: {
      info: {
        title: "HookRelay API",
        description: "Webhook delivery platform API",
        version: "0.0.0",
      },
      tags: [
        { name: "health", description: "Liveness and readiness checks" },
      ],
    },
  });

  await app.register(scalar, { routePrefix: "/docs" });
}
