import { Queue, Worker } from "bullmq";
import IORedis from "ioredis";
import dotenv from "dotenv";
import { sendNotification } from "./notificationService";

dotenv.config();
const connection = new IORedis(process.env.REDIS_URL as string, {
  maxRetriesPerRequest: null,
});

// Define the job data type
interface NotificationJob {
  type: string;
  userId: number;
  params: Record<string, any>;
}

// Create a queue for notifications
const notificationQueue = new Queue<NotificationJob>("notificationQueue", {
  connection,
});

// Worker to process jobs asynchronously
const worker = new Worker<NotificationJob>(
  "notificationQueue",
  async (job) => {
    const { type, userId, params } = job.data;
    console.log(`Processing Notification: ${type} for User ${userId}`);
    await sendNotification(type, userId, params);
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
