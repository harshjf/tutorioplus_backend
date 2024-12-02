import type { Request, RequestHandler, Response } from "express";

import { userService } from "@/api/user/userService";
import { handleServiceResponse } from "@/common/utils/httpHandlers";

class UserController {
  public getUsers: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await userService.findAll();
    return handleServiceResponse(serviceResponse, res);
  };

  public signIn: RequestHandler = async(req: Request, res: Response) =>{
    const {email,password} = req.body;
    const serviceResponse = await userService.signIn(email,password);
    return handleServiceResponse(serviceResponse,res);
  };

  public signUp: RequestHandler = async(req: Request, res: Response) =>{
    const {name,email,password,countryId,stateId,cityId,pinCode,purposeOfSignIn,first_payment_date} = req.body;
    const serviceResponse = await userService.signUp(name,email,password,countryId,stateId,cityId,pinCode,purposeOfSignIn,first_payment_date);
    return handleServiceResponse(serviceResponse,res);
  };

  public getCountries: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await userService.getAllCountries();
    return handleServiceResponse(serviceResponse, res);
  };
  public getStates: RequestHandler = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id);
    const serviceResponse = await userService.getStates(id);
    return handleServiceResponse(serviceResponse, res);
  };
  public getCities: RequestHandler = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id);
    const serviceResponse = await userService.getCities(id);
    return handleServiceResponse(serviceResponse, res);
  };
}

export const userController = new UserController();
