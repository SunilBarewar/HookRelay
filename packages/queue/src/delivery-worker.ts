import { Worker } from "bullmq";
import { DELIVERY_QUEUE } from "./constants.ts";
import type { DeliveryJob, DeliveryJobData } from "./types.ts";

export const createDeliveryWorker = (
  processor: (job: DeliveryJob) => Promise<void>,
  connectionUrl: string,
) => {
  return new Worker<DeliveryJobData>(DELIVERY_QUEUE, processor, {
    connection: { url: connectionUrl },
  });
};
