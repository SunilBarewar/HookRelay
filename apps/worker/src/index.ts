import { createDeliveryWorker, type DeliveryJob } from "@hookrelay/queue";

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  throw new Error("REDIS_URL is required");
}

// Dummy processor: real delivery (HTTP POST, signing, status updates) comes later.
// Throwing from here is what makes BullMQ retry the job.
async function processDelivery(job: DeliveryJob): Promise<void> {
  console.log(
    `[worker] processing delivery ${job.data.deliveryId} (attempt ${job.attemptsMade + 1})`,
  );
}

const worker = createDeliveryWorker(processDelivery, redisUrl);

worker.on("completed", (job) => console.log(`[worker] completed ${job.id}`));
worker.on("failed", (job, error) => console.error(`[worker] failed ${job?.id}: ${error.message}`));
worker.on("error", (error) => console.error("[worker] error", error));

async function shutdown(signal: string) {
  console.log(`[worker] ${signal} received, shutting down`);
  await worker.close();
  process.exit(0);
}

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));

console.log("[worker] started, waiting for deliveries");
