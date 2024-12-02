import { z } from "zod";


export type Faq = z.infer<typeof FaqSchema>;
export const FaqSchema = z.object({
    id:z.number(),  
    title: z.string(),       
    description: z.string(),          
    priority: z.number()
});