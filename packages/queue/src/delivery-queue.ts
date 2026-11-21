import { Queue } from "bullmq";
import { DELIVERY_QUEUE } from "./constants.ts";
import type { DeliveryJobData } from "./types.ts";

export type DeliveryQueue = Queue<DeliveryJobData>;

export const MAX_ATTEMPTS = 5;
export const BACKOFF_DELAY = 5_000; // 5 seconds, doubles on each retry

export const createDeliveryQueue = (connectionString: string): DeliveryQueue => {
  return new Queue<DeliveryJobData>(DELIVERY_QUEUE, {
    connection: { url: connectionString },
    defaultJobOptions: {
      attempts: MAX_ATTEMPTS,
      backoff: { type: "exponential", delay: BACKOFF_DELAY },
      removeOnComplete: true,
      removeOnFail: false,
    },
  });
};

// jobId = deliveryId makes enqueueing idempotent.
export const enqueueDeliveries = (queue: DeliveryQueue, deliveryIds: string[]) => {
  return queue.addBulk(
    deliveryIds.map((deliveryId) => ({
      name: "deliver-event",
      data: { deliveryId },
      opts: { jobId: deliveryId },
    })),
  );
};
