import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { pino } from "pino";
import * as crypto from "crypto";
import { openAPIRouter } from "@/api-docs/openAPIRouter";
import { healthCheckRouter } from "@/api/healthCheck/healthCheckRouter";
import { userRouter } from "@/api/user/userRouter";
import errorHandler from "@/common/middleware/errorHandler";
import rateLimiter from "@/common/middleware/rateLimiter";
import requestLogger from "@/common/middleware/requestLogger";
import { env } from "@/common/utils/envConfig";
import dotenv from "dotenv";
import { serviceRouter } from "./api/service/serviceRouter";
import { faqRouter } from "./api/faq/faqRouter";
import { grievanceRouter } from "./api/grievance/grievanceRouter";
import { newsAndAnnouncementRouter } from "./api/news/newsAndAnnouncementRouter";

const logger = pino({ name: "server start" });
const app: Express = express();
dotenv.config();

const secretKey = crypto.randomBytes(32).toString("hex");

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://147.93.111.144",
    "https://tutorioplus.com",
    "https://tutorioplus.com/",
    "https://admin.tutorioplus.com",
    "https://admin.tutorioplus.com/",
  ] /* env.CORS_ORIGIN */,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// Set the application to trust the reverse proxy
app.set("trust proxy", true);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(helmet());
//app.use(rateLimiter);

// Request logging
app.use(requestLogger);

// Routes
app.use("/api/health-check", healthCheckRouter);
app.use("/api/users", userRouter);
app.use("/api/services", serviceRouter);
app.use("/api/faqs", faqRouter);
app.use("/api/grievances", grievanceRouter);
app.use("/api/newsandannouncements", newsAndAnnouncementRouter);
// Swagger UI
app.use("/api/docs", openAPIRouter);

// Error handlers
app.use(errorHandler());

export { app, logger };
