import { createDeliveryQueue, type DeliveryQueue } from "@hookrelay/queue";
import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

import { Config } from "@/env.ts";

declare module "fastify" {
  interface FastifyInstance {
    deliveryQueue: DeliveryQueue;
  }
}

// fastify-plugin disables encapsulation so `app.deliveryQueue` is visible to the routes.
export const registerQueue = fp(async (app: FastifyInstance) => {
  const deliveryQueue = createDeliveryQueue(Config.REDIS_URL);

  app.decorate("deliveryQueue", deliveryQueue);
  app.addHook("onClose", async () => {
    await deliveryQueue.close();
  });
});
