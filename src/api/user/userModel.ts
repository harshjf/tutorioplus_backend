import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

export type User = z.infer<typeof UserSchema>;
export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  password:z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const GetUserSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});

export const UserSignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const UserSignUpSchema = z.object({
  name:z.string(),
  email: z.string().email(),
  password: z.string().min(8),
  countryId:z.number(),
  stateId:z.number(),
  cityId:z.number(),
  pincode:z.string(),
  purposeOfSignIn:z.string(),
  firstPaymentDate:z.date()
});

export const UserResetPasswordSchema = z.object({
  email:z.string().email()
});

export const UserConfirmResetPasswordSchema = z.object({
  email:z.string().email(),
  password: z.string().min(8)
});

export const SubjectSchema = z.object({
  id: z.number(),
  name: z.string(),
});
export type subject = z.infer<typeof SubjectSchema>;

export const StudentSchema = z.object({
  user_id: z.number(),
  user_name: z.string(),
  country:z.string(),
  state:z.string(),
  city:z.string(),
  user_email: z.string().email(),
  user_role_id: z.number(),
  metadata_id: z.number(),
  pincode: z.string().optional(),
  address: z.string().optional(),
  phone_number: z.string().optional(),
  purpose_of_sign_in: z.string().optional(),
  first_payment_date: z.string().optional(),  
  metadata_created_at: z.string(),  
  metadata_updated_at: z.string(),  
});
export const getStudentFilter=z.object({
  email:z.string(),
  name:z.string(),
  phone_number:z.string()
})
export type getStudentFilter = z.infer<typeof getStudentFilter>;
// Type inference
export type Student = z.infer<typeof StudentSchema>;

export type Country = z.infer<typeof CountrySchema>;
export const CountrySchema=z.object({
  id: z.number(),
  name: z.string(),
  dial_code: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type State = z.infer<typeof StateSchema>;
export const StateSchema=z.object({
  id: z.number(),
  name: z.string(),
  country_id: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export const GetStateSchema = z.object({
  params: z.object({ id: commonValidations.id }),  
});

export type City = z.infer<typeof CitySchema>;
export const CitySchema=z.object({
  id: z.number(),
  name: z.string(),
  state_id: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export const GetCitySchema = z.object({
  params: z.object({ id: commonValidations.id }),  
});


export const MentorSignUpSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  phone_number: z.string().max(15),
  address: z.string(),
  qualification: z.string(),
  teaching_experience: z.number(),
  job_type: z.enum(["part-time", "full-time"]),
  country: z.string(),
  state: z.string(),
  city: z.string(),
});
export type MentorSignUpSchema = z.infer<typeof MentorSignUpSchema>;

export const getMentorFilter=z.object({
  email:z.string(),
  name:z.string(),
  phone_number:z.string()
})
export type getMentorFilter = z.infer<typeof getMentorFilter>;