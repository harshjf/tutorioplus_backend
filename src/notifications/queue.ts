import { Queue, Worker } from "bullmq";
import IORedis from "ioredis";
import dotenv from "dotenv";
import { sendNotification } from "./notificationService";

dotenv.config();
const connection = new IORedis(process.env.REDIS_URL as string, {
  maxRetriesPerRequest: null,
});

interface NotificationJob {
  type: string;
  userId?: number;
  recipientRole?: string;
  params: Record<string, any>;
}

const notificationQueue = new Queue<NotificationJob>("notificationQueue", {
  connection,
});

const worker = new Worker<NotificationJob>(
  "notificationQueue",
  async (job) => {
    const { type, userId, params, recipientRole } = job.data;
    console.log(`Processing Notification: ${type} for User ${userId}`);
    await sendNotification(type, userId, params, recipientRole);
  },
  { connection }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

worker.on("failed", (job, err) => {
  const jobId = job?.id || "Unknown";
  console.error(`Job ${jobId} failed: ${err.message}`);
});

export default notificationQueue;
