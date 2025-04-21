import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";
import { createApiBody, createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { GrievanceCreateSchema, GrievanceSchema } from "@/api/grievance/grievanceModel";
import { grievanceController } from "./grievanceController";
import { verifyToken } from "@/common/middleware/jwtVerification";
import { authorize } from "@/common/middleware/authorize";

export const grievanceRegistry = new OpenAPIRegistry();
export const grievanceRouter: Router = express.Router();

grievanceRegistry.register("Grievance", GrievanceSchema);

grievanceRegistry.registerPath({
  method: "post",
  path: "/grievances",
  tags: ["Grievance"],
  responses: createApiResponse(z.array(GrievanceSchema), "Success"),
});
grievanceRouter.post("/", verifyToken, authorize(["Admin"]),grievanceController.getGrievances);

grievanceRegistry.registerPath({
    method: "post",
    path: "/grievances",
    tags: ["Grievance"],
    requestBody: createApiBody(GrievanceCreateSchema),
    responses: createApiResponse(GrievanceSchema, "Success"),
  });
  
grievanceRouter.post("/addGrievance",verifyToken,authorize(["Student"]), grievanceController.createGrievance);

grievanceRegistry.registerPath({
  method: "post",
  path: "/grievances",
  tags: ["Grievance"],
  responses: createApiResponse(GrievanceSchema, "Success"),
});

grievanceRouter.post("/deleteGrievance",verifyToken,authorize(["Admin"]), grievanceController.deleteGrievance);

grievanceRegistry.registerPath({
  method: "post",
  path: "/grievances",
  tags: ["Grievance"],
  responses: createApiResponse(GrievanceSchema, "Success"),
});

grievanceRouter.post("/markAsResolved",verifyToken,authorize(["Admin"]), grievanceController.markAsResolved);

