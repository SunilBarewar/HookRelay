import { Worker, type Job } from "bullmq";
import { DELIVERY_QUEUE } from "./constants.ts";
import type { DeliveryJobData } from "./types.ts";

export const createDeliveryWorker = (
  processor: (job: Job<DeliveryJobData>) => Promise<void>,
  connectionUrl: string,
) => {
  return new Worker<DeliveryJobData>(DELIVERY_QUEUE, processor, {
    connection: { url: connectionUrl },
  });
};
