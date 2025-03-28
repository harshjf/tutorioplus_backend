import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";
import {
  createApiBody,
  createApiResponse,
} from "@/api-docs/openAPIResponseBuilders";
import {
  UserConfirmResetPasswordSchema,
  UserResetPasswordSchema,
  UserSchema,
  UserSignInSchema,
  UserSignUpSchema,
  MentorSignUpSchema,
  StudentSchema,
} from "@/api/user/userModel";
import { userController } from "./userController";
import { verifyToken } from "@/common/middleware/jwtVerification";
import { multipleFileUploadMiddleware } from "@/common/middleware/multipleFileUploadMiddleware";
import { authorize } from "@/common/middleware/authorize";

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
  path: "/users/addmentor",
  tags: ["User"],
  requestBody: createApiBody(MentorSignUpSchema),
  responses: createApiResponse(z.object({ message: z.string() }), "Success"),
});
userRouter.post(
  "/addmentor",
  multipleFileUploadMiddleware,
  userController.addMentor
);

userRegistry.registerPath({
  method: "post",
  path: "/users/resetpassword",
  tags: ["User"],
  requestBody: createApiBody(UserResetPasswordSchema),
  responses: createApiResponse(z.object({ token: z.string() }), "Success"),
});
userRouter.post("/resetpassword", userController.resetPassword);

userRegistry.registerPath({
  method: "post",
  path: "/users/confirmresetpassword",
  tags: ["User"],
  requestBody: createApiBody(UserConfirmResetPasswordSchema),
  responses: createApiResponse(z.object({ token: z.string() }), "Success"),
});
userRouter.post("/confirmresetpassword", userController.confirmResetPassword);

userRegistry.registerPath({
  method: "get",
  path: "/users/getsubjects",
  tags: ["User"],
  responses: createApiResponse(z.object({ token: z.string() }), "Success"),
});
userRouter.get("/getsubjects", verifyToken, userController.getSubjects);

userRegistry.registerPath({
  method: "post",
  path: "/users/getstudents",
  tags: ["User"],
  responses: createApiResponse(z.object({ token: z.string() }), "Success"),
});
userRouter.post(
  "/getstudents",
  verifyToken,
  authorize(["Admin"]),
  userController.getStudents
);

userRegistry.registerPath({
  method: "post",
  path: "/users/editstudent",
  tags: ["User"],
  responses: createApiResponse(z.object({ message: z.string() }), "Success"),
});
userRouter.post(
  "/editstudent",
  verifyToken,
  authorize(["Admin", "Student"]),
  userController.editStudent
);

userRegistry.registerPath({
  method: "post",
  path: "/users/deleteuser",
  tags: ["User"],
  responses: createApiResponse(z.object({ message: z.string() }), "Success"),
});
userRouter.post(
  "/deleteuser",
  verifyToken,
  authorize(["Admin"]),
  userController.deleteUser
);

userRegistry.registerPath({
  method: "get",
  path: "/users/getstudent/{id}",
  tags: ["User"],
  responses: createApiResponse(StudentSchema, "Success"),
});

userRouter.get(
  "/getstudent/:id",
  verifyToken,
  authorize(["Student"]),
  userController.getStudent
);

userRegistry.registerPath({
  method: "post",
  path: "/users/getmentors",
  tags: ["User"],
  responses: createApiResponse(z.object({ token: z.string() }), "Success"),
});
userRouter.post(
  "/getmentors",
  verifyToken,
  authorize(["Admin"]),
  userController.getMentors
);

userRegistry.registerPath({
  method: "post",
  path: "/users/editmentor",
  tags: ["User"],
  requestBody: createApiBody(MentorSignUpSchema),
  responses: createApiResponse(z.object({ message: z.string() }), "Success"),
});
userRouter.post(
  "/editmentor",
  verifyToken,
  authorize(["Admin"]),
  multipleFileUploadMiddleware,
  userController.editMentor
);

userRegistry.registerPath({
  method: "post",
  path: "/users/approvetutor",
  tags: ["User"],
  responses: createApiResponse(z.object({ message: z.string() }), "Success"),
});
userRouter.post(
  "/approvetutor",
  verifyToken,
  authorize(["Admin"]),
  userController.approveTutor
);

userRegistry.registerPath({
  method: "post",
  path: "/users/changepassword",
  tags: ["User"],
  responses: createApiResponse(z.object({ message: z.string() }), "Success"),
});
userRouter.post("/changepassword", verifyToken, userController.changePassword);
