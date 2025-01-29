import { z } from "zod";


export type Service = z.infer<typeof ServiceSchema>;
export const ServiceSchema = z.object({
  id: z.number(),
  service_type: z.string(),
  category: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type AddServiceRequest = z.infer<typeof AddServiceRequestSchema>;
export const AddServiceRequestSchema = z.object({
  studentId: z.number(),
  mentorId: z.number().optional(),
  serviceId: z.number(),
  docPath: z.string().optional(),
  description: z.string().optional(),
  dueDate: z.date().optional(),
  scheduleTime: z.date().optional(),
  duration: z.number().optional(),
  link: z.string().optional(),
  subjectId: z.number().optional(),
});

export type DocumentBasedService = z.infer<typeof DocumentBasedServiceSchema>;
export const DocumentBasedServiceSchema=z.object({
    id:z.number(),
    student_id:z.number() ,           
	subject_id:z.number() ,
    mentor_id:z.number() ,            
    service_id :z.number(),           
    doc_path: z.string(),            
    description:z.string() ,                  
    due_date :z.date(),               
    created_at:z.date(),
    updated_at:z.date(),
});

export type SessionBasedService = z.infer<typeof SessionBasedServiceSchema>;
export const SessionBasedServiceSchema=z.object({
    id:z.number(),
    student_id:z.number() ,           
    mentor_id:z.number() ,            
    service_id :z.number(),           
    schedule_time:z.date(),  
    duration:z.string(),             
    link:z.string().optional(),                                     
    created_at:z.date(),
    updated_at:z.date(),
});

export const GetAssignmentListFilter=z.object({
  name:z.string(),
  description:z.string(),
  due_date:z.string(),
  services:z.string(),
  student_id: z.string().optional() 
})
export type GetAssignmentListFilter = z.infer<typeof GetAssignmentListFilter>;