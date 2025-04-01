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
    description: z.string(),
    //status: z.string().optional(), 
});

export const GetGrievanceListFilter=z.object({
  student_name:z.string().optional() ,
  student_email:z.string().optional() ,
  student_phone:z.string().optional() ,
  services:z.string().optional() ,
  description:z.string().optional() ,
  status:z.string().optional() ,
  created_at:z.string().optional() ,
  student_id: z.string().optional() 
})
export type GetGrievanceListFilter = z.infer<typeof GetGrievanceListFilter>;