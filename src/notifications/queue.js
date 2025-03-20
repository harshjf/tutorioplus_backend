import { Queue, Worker } from "bullmq";
import IORedis from "ioredis";
import dotenv from "dotenv";
import notificationService from "./notificationService";

dotenv.config();
const connection = new IORedis(process.env.REDIS_URL);

// Create a queue for notifications
const notificationQueue = new Queue("notificationQueue", { connection });

// Worker to process jobs asynchronously
const worker = new Worker(
  "notificationQueue",
  async (job) => {
    const { type, userId, params } = job.data;
    console.log(`Processing Notification: ${type} for User ${userId}`);
    await notificationService.sendNotification(type, userId, params);
  },
  { connection }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job.id} failed: ${err.message}`);
});

export default notificationQueue;
