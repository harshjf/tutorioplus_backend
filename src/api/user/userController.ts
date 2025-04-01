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
    const {name,email,password,country,state,city,pinCode,purposeOfSignIn,first_payment_date,address,phone,countryCode} = req.body;
    const serviceResponse = await userService.signUp(name,email,password,country,state,city,pinCode,purposeOfSignIn,first_payment_date,address,phone,countryCode);
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

  public editStudent: RequestHandler = async (req: Request, res: Response) => {
    const { id, name, email, country, state, city, pinCode, address, phone } = req.body;
    const serviceResponse = await userService.editStudent(
      id, name, email, country, state, city, pinCode,  address, phone
    );
  
    return handleServiceResponse(serviceResponse, res);
  };  

  public deleteUser: RequestHandler = async (req: Request, res: Response) => {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ message: "Student ID is required" });
    }
    const serviceResponse = await userService.deleteUser(id); 
    return handleServiceResponse(serviceResponse, res);
  };

  public getStudent: RequestHandler=async(req: Request, res: Response) =>{
    const { id } = req.params;
    const serviceResponse = await userService.findById(Number(id));
    return handleServiceResponse(serviceResponse, res);
  }
  public getMentors: RequestHandler=async(req: Request, res:Response)=>{
    const {filter} = req.body;
    const serviceResponse=await userService.getMentors(filter);
    return handleServiceResponse(serviceResponse,res);
  }
  public editMentor: RequestHandler = async(req: Request, res: Response) =>{
    const serviceResponse = await userService.editMentor(req);
    return handleServiceResponse(serviceResponse,res);
  };
  public approveTutor: RequestHandler = async(req:Request, res: Response) =>{
    const serviceResponse = await userService.approveTutor(req);
    return handleServiceResponse(serviceResponse,res);
  };
  public changePassword: RequestHandler = async (req: Request, res: Response) => {
    const { id, current_password, new_password } = req.body;
    const serviceResponse = await userService.changePassword(id, current_password, new_password);
    return handleServiceResponse(serviceResponse, res);
  };
  public getUserStats: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await userService.getUserStats();
    return handleServiceResponse(serviceResponse, res);
  };
  public getAssignmentActivity: RequestHandler = async (req: Request, res: Response) => {
    const range = req.query.range as "week" | "month" | "year";
    const serviceResponse = await userService.getAssignmentActivity(range);
    return handleServiceResponse(serviceResponse, res);
  };
  public getNotifications: RequestHandler = async (req: Request, res: Response) => {
    const userId = parseInt(req.query.userId as string);
    const offset = parseInt(req.query.offset as string) || 0;
    const limit = parseInt(req.query.limit as string) || 10;
  
    const serviceResponse = await userService.getNotifications(userId, offset, limit);
    return handleServiceResponse(serviceResponse, res);
  };
  
}



export const userController = new UserController();
