import type { Job } from "bullmq";

export type DeliveryJobData = {
  deliveryId: string;
};

export type DeliveryJob = Job<DeliveryJobData>;
