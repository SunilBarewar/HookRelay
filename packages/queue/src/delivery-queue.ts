import { Queue } from "bullmq";
import { DELIVERY_QUEUE } from "./constants";

import type { DeliveryJobData } from "./types";

export type DeliveryQueue = Queue<DeliveryJobData>;

export const MAX_ATTEMPTS = 5;
export const BACKOFF_DELAY = 5_000; // 5 seconds

export const createDeliveryQueue = (connectionString: string): DeliveryQueue => {
  return new Queue<DeliveryJobData>(DELIVERY_QUEUE, {
    connection: {
      url: connectionString,
    },
    defaultJobOptions: {
      attempts: 5,
      backoff: { type: "exponential", delay: BACKOFF_DELAY }, // 5s, 10s, 20s
      removeOnComplete: true,
      removeOnFail: false,
    },
  });
};

export const enqueueDeliveries = (queue: DeliveryQueue, deliveryIds: string[]) => {
  return queue.addBulk(
    deliveryIds.map((deliveryId) => ({
      name: "deliver-event",
      data: { deliveryId },
      opts: { jobId: deliveryId },
    })),
  );
};
