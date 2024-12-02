import type { Request, RequestHandler, Response } from "express";

import { serviceService } from "@/api/service/serviceService";
import { handleServiceResponse } from "@/common/utils/httpHandlers";

class ServiceController{
    public getServices: RequestHandler = async (_req: Request, res: Response) => {
        const serviceResponse = await serviceService.getAllServices();
        return handleServiceResponse(serviceResponse, res);
      };
    
      public addService: RequestHandler = async (req: Request, res: Response) => {
        //console.log("Request",req);
        const serviceResponse = await serviceService.addService(req);
        return handleServiceResponse(serviceResponse, res);
      };
}

export const serviceController = new ServiceController();