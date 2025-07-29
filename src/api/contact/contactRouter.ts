// api/contact/contactRouter.ts
import express from "express";
import { submitContactForm } from "./contactController";

const router = express.Router();

router.post("/", submitContactForm);

export default router;
