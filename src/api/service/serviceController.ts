import type { Request, RequestHandler, Response } from "express";

import { serviceService } from "@/api/service/serviceService";
import { handleServiceResponse } from "@/common/utils/httpHandlers";

class ServiceController{
    public getServices: RequestHandler = async (_req: Request, res: Response) => {
      const serviceResponse = await serviceService.getAllServices();
      return handleServiceResponse(serviceResponse, res);
    };
    
    public addService: RequestHandler = async (req: Request, res: Response) => {
      const serviceResponse = await serviceService.addService(req);
      return handleServiceResponse(serviceResponse, res);
    };

    public getAssignmentList: RequestHandler = async(req: Request, res:Response) =>{
      const { filter, student_id } = req.body || {};
      const serviceResponse = await serviceService.getAssignmentList(filter, student_id);
      return handleServiceResponse(serviceResponse, res);
    };

    public getSessionsList: RequestHandler = async(req: Request, res:Response) =>{
      const { filter, student_id } = req.body || {};
      const serviceResponse = await serviceService.getSessionsList(filter, student_id);
      return handleServiceResponse(serviceResponse, res);
    };

    public assignMentor: RequestHandler = async(req: Request, res: Response) =>{
      const{doc_based_service_id, mentor_id} = req.body || {};
      const serviceResponse = await serviceService.assignMentor(doc_based_service_id, mentor_id);
      return handleServiceResponse(serviceResponse, res);
    };
 
    public submitAnswer: RequestHandler = async (req: Request, res: Response) => {
      const serviceResponse = await serviceService.submitAnswer(req);
      return handleServiceResponse(serviceResponse, res);
    };
    public deleteAssignment: RequestHandler = async (req: Request, res: Response) => {
      const serviceResponse = await serviceService.deleteAssignment(req);
      return handleServiceResponse(serviceResponse, res);
    };
    public deleteSession: RequestHandler = async (req: Request, res: Response) => {
      const serviceResponse = await serviceService.deleteSession(req);
      return handleServiceResponse(serviceResponse, res);
    };
    
}

export const serviceController = new ServiceController();