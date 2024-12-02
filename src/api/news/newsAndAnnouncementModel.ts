import { z } from "zod";

export type NewsAndAnnouncement = z.infer<typeof NewsAndAnnouncementSchema>;
export const NewsAndAnnouncementSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const NewsAndAnnouncementCreateSchema = z.object({
  title: z.string(),
  description: z.string(),
});
