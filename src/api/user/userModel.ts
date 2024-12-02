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

// Input Validation for 'GET users/:id' endpoint
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
