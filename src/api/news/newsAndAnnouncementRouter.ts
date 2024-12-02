import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";
import { createApiBody, createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { NewsAndAnnouncementCreateSchema, NewsAndAnnouncementSchema } from "@/api/news/newsAndAnnouncementModel";
import { newsAndAnnouncementController } from "./newsAndAnnouncementController";

export const newsAndAnnouncementRegistry = new OpenAPIRegistry();
export const newsAndAnnouncementRouter: Router = express.Router();

newsAndAnnouncementRegistry.register("NewsAndAnnouncement", NewsAndAnnouncementSchema);

newsAndAnnouncementRegistry.registerPath({
  method: "get",
  path: "/newsandannouncements",
  tags: ["NewsAndAnnouncement"],
  responses: createApiResponse(z.array(NewsAndAnnouncementSchema), "Success"),
});

newsAndAnnouncementRouter.get("/", newsAndAnnouncementController.getNewsAndAnnouncements);

newsAndAnnouncementRegistry.registerPath({
    method: "post",
    path: "/newsandannouncements",
    tags: ["NewsAndAnnouncement"],
    requestBody: createApiBody(NewsAndAnnouncementCreateSchema),
    responses: createApiResponse(NewsAndAnnouncementSchema, "Success"),
});
  
newsAndAnnouncementRouter.post("/add", newsAndAnnouncementController.createNewsAndAnnouncement);
