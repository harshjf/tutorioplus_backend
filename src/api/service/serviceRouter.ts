import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";
import { createApiBody, createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import {  AddServiceRequestSchema, ServiceSchema } from "@/api/service/serviceModel";
import { serviceController } from "./serviceController";
import { optionalFileUpload } from "@/common/middleware/uploadMiddleware";
import { verifyToken } from "@/common/middleware/jwtVerification";

export const serviceRegistry = new OpenAPIRegistry();
export const serviceRouter: Router = express.Router();

serviceRegistry.register("Services", ServiceSchema);

serviceRegistry.registerPath({
  method: "get",
  path: "/services",
  tags: [""],
  responses: createApiResponse(z.array(ServiceSchema), "Success"),
});

serviceRouter.get("/",serviceController.getServices);


serviceRegistry.registerPath({
    method: "post",
    path: "/services/addService",
    tags: ["Services"],
    requestBody: createApiBody(AddServiceRequestSchema),
    responses: createApiResponse(z.string(), "Success"),
});

serviceRouter.post(
  "/addService",
  verifyToken,
  optionalFileUpload,
  serviceController.addService
);

serviceRegistry.registerPath({
  method: "post",
  path: "/services/addService",
  tags: ["Services"],
  requestBody: createApiBody(AddServiceRequestSchema),
  responses: createApiResponse(z.string(), "Success"),
});

serviceRouter.post(
"/addService",
verifyToken,
optionalFileUpload,
serviceController.addService
);

serviceRegistry.registerPath({
  method: "post",
  path: "/services/getAssignmentList",
  tags: ["Services"],
  responses: createApiResponse(z.string(), "Success"),
});

serviceRouter.post(
"/getAssignmentList",
verifyToken,
serviceController.getAssignmentList
);

serviceRouter.post(
  "/getSessionsList",
  verifyToken,
  serviceController.getSessionsList
  );
  
  serviceRegistry.registerPath({
    method: "post",
    path: "/services/getSessionsList",
    tags: ["Services"],
    responses: createApiResponse(z.string(), "Success"),
  });

serviceRegistry.registerPath({
  method: "post",
  path: "/services/submitAnswer",
  tags: ["Services"],
  responses: createApiResponse(z.string(), "Success"),
});

serviceRouter.post(
  "/submitAnswer",
  verifyToken,
  optionalFileUpload,
  serviceController.submitAnswer
);


serviceRegistry.registerPath({
  method: "post",
  path: "/services/assignmentor",
  tags: ["Services"],
  responses: createApiResponse(z.string(), "Success"),
});

serviceRouter.post(
"/assignmentor",
verifyToken,
serviceController.assignMentor
);

serviceRegistry.registerPath({
  method: "post",
  path: "/services/deleteAssignment",
  tags: ["Services"],
  responses: createApiResponse(z.string(), "Success"),
});

serviceRouter.post(
  "/deleteAssignment",
  verifyToken,
  serviceController.deleteAssignment
);

serviceRegistry.registerPath({
  method: "post",
  path: "/services/deleteSession",
  tags: ["Services"],
  responses: createApiResponse(z.string(), "Success"),
});

serviceRouter.post(
  "/deleteSession",
  verifyToken,
  serviceController.deleteSession
);



  