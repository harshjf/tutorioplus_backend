import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";
import { createApiBody, createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import {  AddServiceRequestSchema, ServiceSchema } from "@/api/service/serviceModel";
import { serviceController } from "./serviceController";
import { optionalFileUpload } from "@/common/middleware/uploadMiddleware";
import { verifyToken } from "@/common/middleware/jwtVerification";
import { authorize } from "@/common/middleware/authorize";

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
  method: "get",
  path: "/services/getservicesfornavbar",
  tags: ["Services"],
  responses: createApiResponse(z.array(ServiceSchema), "Success"),
});

serviceRouter.get("/getservicesfornavbar",
  verifyToken ,authorize(["Student"]),serviceController.getServicesForNavbar);

serviceRegistry.registerPath({
    method: "get",
    path: "/services/details/:id",
    tags: ["Services"],
    responses: createApiResponse(z.array(ServiceSchema), "Success"),
});
  
serviceRouter.get("/details/:id",
    verifyToken ,authorize(["Student"]),serviceController.getServiceDetails);

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
  authorize(["Student"]),
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
verifyToken ,authorize(["Admin","Student"]),
serviceController.getAssignmentList
);

serviceRouter.post(
  "/getSessionsList",
  verifyToken,
  authorize(["Admin","Student"]),
  serviceController.getSessionsList
  );
  
  serviceRegistry.registerPath({
    method: "post",
    path: "/services/getSessionsList",
    tags: ["Services"],
    responses: createApiResponse(z.string(), "Success"),
  });

  serviceRouter.post(
    "/getOtherServicesList",
    verifyToken,
    authorize(["Admin","Student"]),
    serviceController.getOtherServicesList
    );
    
    serviceRegistry.registerPath({
      method: "post",
      path: "/services/getOtherServicesList",
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
  verifyToken ,authorize(["Admin"]),
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
  authorize(["Admin"]),
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
  authorize(["Admin"]),
  serviceController.deleteSession
);

serviceRegistry.registerPath({
  method: "post",
  path: "/services/updateStatus",
  tags: ["Services"],
  responses: createApiResponse(z.string(), "Success"),
});

serviceRouter.post(
  "/updateStatus",
  verifyToken,
  authorize(["Admin"]),
  serviceController.updateStatus
);

serviceRegistry.registerPath({
  method: "post",
  path: "/services/addPayment",
  tags: ["Services"],
  responses: createApiResponse(z.string(), "Success"),
});

serviceRouter.post(
  "/addPayment",
  serviceController.addPayment
); 