import { z } from "zod";

export type Grievance = z.infer<typeof GrievanceSchema>;
export const GrievanceSchema = z.object({
  id: z.number(),
  student_id: z.number(),
  service_id: z.number(),
  description: z.string(),
  status: z.string(),
  created_at: z.string(), 
  updated_at: z.string(), 
  student_name: z.string().optional(),
  service_name: z.string().optional(),
});

export const GrievanceCreateSchema = z.object({
    student_id: z.number(),
    service_id: z.number(),
    description: z.string(),
    //status: z.string().optional(), 
});