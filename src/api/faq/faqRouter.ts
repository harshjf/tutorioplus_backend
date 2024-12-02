import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { FaqSchema } from "@/api/faq/faqModel";
import { faqController } from "./faqController";


export const faqRegistry = new OpenAPIRegistry();
export const faqRouter: Router = express.Router();

faqRegistry.register("Faq", FaqSchema);

faqRegistry.registerPath({
  method: "get",
  path: "/faqs",
  tags: ["Faq"],
  responses: createApiResponse(z.array(FaqSchema), "Success"),
});

faqRouter.get("/", faqController.getFaqs);