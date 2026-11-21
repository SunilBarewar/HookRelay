import { closeDatabase } from "@hookrelay/db";
import { createDeliveryWorker } from "@hookrelay/queue";

import { deliverWebhook } from "./process-delivery.ts";

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  throw new Error("REDIS_URL is required");
}

const worker = createDeliveryWorker(deliverWebhook, redisUrl);

worker.on("completed", (job) => console.log(`[worker] completed ${job.id}`));
worker.on("failed", (job, error) => console.error(`[worker] failed ${job?.id}: ${error.message}`));
worker.on("error", (error) => console.error("[worker] error", error));

async function shutdown(signal: string) {
  console.log(`[worker] ${signal} received, shutting down`);
  await worker.close();
  await closeDatabase();
  process.exit(0);
}

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));

console.log("[worker] started, waiting for deliveries");
