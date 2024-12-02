import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";
import { createApiBody, createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import {  AddServiceRequestSchema, ServiceSchema } from "@/api/service/serviceModel";
import { validateRequest } from "@/common/utils/httpHandlers";
import { serviceController } from "./serviceController";
import { optionalFileUpload } from "@/common/middleware/uploadMiddleware";

export const serviceRegistry = new OpenAPIRegistry();
export const serviceRouter: Router = express.Router();

serviceRegistry.register("Services", ServiceSchema);

serviceRegistry.registerPath({
  method: "get",
  path: "/services",
  tags: [""],
  responses: createApiResponse(z.array(ServiceSchema), "Success"),
});

serviceRouter.get("/", serviceController.getServices);


serviceRegistry.registerPath({
    method: "post",
    path: "/services/addService",
    tags: ["Services"],
    requestBody: createApiBody(AddServiceRequestSchema),
    responses: createApiResponse(z.string(), "Success"),
  });
  serviceRouter.post(
    "/addService",
    optionalFileUpload,
    serviceController.addService
  );
  