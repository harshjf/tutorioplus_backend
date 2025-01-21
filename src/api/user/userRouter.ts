import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";
import { createApiBody, createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { GetCitySchema, GetStateSchema, GetUserSchema, UserConfirmResetPasswordSchema, UserResetPasswordSchema, UserSchema, UserSignInSchema,UserSignUpSchema } from "@/api/user/userModel";
import { validateRequest } from "@/common/utils/httpHandlers";
import { userController } from "./userController";
import { verifyToken } from "@/common/middleware/jwtVerification";

export const userRegistry = new OpenAPIRegistry();
export const userRouter: Router = express.Router();

userRegistry.register("User", UserSchema);

userRegistry.registerPath({
  method: "get",
  path: "/users",
  tags: ["User"],
  responses: createApiResponse(z.array(UserSchema), "Success"),
});

userRouter.get("/", userController.getUsers);

/* userRegistry.registerPath({
  method: "get",
  path: "/users/{id}",
  tags: ["User"],
  request: { params: GetUserSchema.shape.params },
  responses: createApiResponse(UserSchema, "Success"),
}); */

/* userRouter.get("/:id", validateRequest(GetUserSchema), userController.getUser); */

userRegistry.registerPath({
  method: "post",
  path: "/users/signin",
  tags: ["User"],
  requestBody: createApiBody(UserSignInSchema),
  responses: createApiResponse(z.object({ token: z.string() }), "Success"),
});

userRouter.post("/signin", userController.signIn);

userRegistry.registerPath({
  method: "post",
  path: "/users/signup",
  tags: ["User"],
  requestBody: createApiBody(UserSignUpSchema),
  responses: createApiResponse(z.object({ token: z.string() }), "Success"),
});
userRouter.post("/signup", userController.signUp);

userRegistry.registerPath({
  method: "post",
  path: "/users/resetpassword",
  tags: ["User"],
  requestBody: createApiBody(UserResetPasswordSchema),
  responses: createApiResponse(z.object({ token: z.string() }), "Success"),
});
userRouter.post("/resetpassword",userController.resetPassword);

userRegistry.registerPath({
  method: "post",
  path: "/users/confirmresetpassword",
  tags: ["User"],
  requestBody: createApiBody(UserConfirmResetPasswordSchema),
  responses: createApiResponse(z.object({ token: z.string() }), "Success"),
});
userRouter.post("/confirmresetpassword",userController.confirmResetPassword);

userRegistry.registerPath({
  method: "get",
  path: "/users/getsubjects",
  tags: ["User"],
  responses: createApiResponse(z.object({ token: z.string() }), "Success"),
});
userRouter.get("/getsubjects",  verifyToken,userController.getSubjects);

/* userRegistry.registerPath({
  method: "get",
  path: "/users/getcountries",
  tags: ["User"],
  responses: createApiResponse(z.object({ token: z.string() }), "Success"),
});
userRouter.get("/getcountries", userController.getCountries);

userRegistry.registerPath({
  method: "get",
  path: "/users/getstates/{id}",
  tags: ["User"],
  request: { params: GetStateSchema.shape.params },
  responses: createApiResponse(GetStateSchema, "Success"),
}); 

 userRouter.get("/getstates/:id", validateRequest(GetStateSchema), userController.getStates);

 userRegistry.registerPath({
  method: "get",
  path: "/users/getcities/{id}",
  tags: ["User"],
  request: { params: GetCitySchema.shape.params },
  responses: createApiResponse(GetCitySchema, "Success"),
}); 

 userRouter.get("/getcities/:id", validateRequest(GetCitySchema), userController.getCities);
 
 
 */