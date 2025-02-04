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
    const {name,email,password,country,state,city,pinCode,purposeOfSignIn,first_payment_date,address,phone} = req.body;
    const serviceResponse = await userService.signUp(name,email,password,country,state,city,pinCode,purposeOfSignIn,first_payment_date,address,phone);
    return handleServiceResponse(serviceResponse,res);
  };

  public addMentor: RequestHandler = async(req: Request, res: Response) =>{
    const serviceResponse = await userService.addMentor(req);
    return handleServiceResponse(serviceResponse,res);
  };

  public resetPassword:RequestHandler=async(req:Request, res:Response) =>{
    const {email}=req.body;
    const serviceResponse= await userService.resetPassword(email);
    return handleServiceResponse(serviceResponse,res);
  }

  public confirmResetPassword:RequestHandler=async(req:Request, res:Response) =>{
    const {token, password}=req.body;
    const serviceResponse=await userService.confirmResetPassword(token,password);
    return handleServiceResponse(serviceResponse,res);
  }
  
  public getSubjects:RequestHandler=async(req:Request, res:Response) =>{
    const serviceResponse=await userService.getSubjects();
    return handleServiceResponse(serviceResponse,res);
  }
  public getStudents:RequestHandler=async(req:Request, res:Response) =>{
    const {filter} = req.body;
    const serviceResponse=await userService.getStudents(filter);
    return handleServiceResponse(serviceResponse,res);
  }
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
