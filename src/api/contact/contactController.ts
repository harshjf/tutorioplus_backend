// api/contact/contactController.ts
import { Request, Response } from "express";
import { handleContactFormSubmission } from "./contactService";

export const submitContactForm = async (req: Request, res: Response) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    await handleContactFormSubmission({ name, email, phone, subject, message });
    res.status(200).json({ message: "Contact form submitted successfully" });
  } catch (error) {
    console.error("Error submitting contact form:", error);
    res.status(500).json({ error: "Failed to submit contact form" });
  }
};
