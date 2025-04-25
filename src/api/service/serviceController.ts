import type { Request, RequestHandler, Response } from "express";

import { serviceService } from "@/api/service/serviceService";
import { handleServiceResponse } from "@/common/utils/httpHandlers";

class ServiceController {
  public getServices: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await serviceService.getAllServices();
    return handleServiceResponse(serviceResponse, res);
  };

  public getServicesForNavbar: RequestHandler = async (
    _req: Request,
    res: Response
  ) => {
    const serviceResponse = await serviceService.getServicesForNavbar();
    return handleServiceResponse(serviceResponse, res);
  };

  public addService: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await serviceService.addService(req);
    return handleServiceResponse(serviceResponse, res);
  };

  public adhocServiceRequest: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    const serviceResponse = await serviceService.adhocServiceRequest(req);
    return handleServiceResponse(serviceResponse, res);
  };

  public getAssignmentList: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    const { filter, student_id } = req.body || {};
    const serviceResponse = await serviceService.getAssignmentList(
      filter,
      student_id
    );
    return handleServiceResponse(serviceResponse, res);
  };

    public getSessionsList: RequestHandler = async(req: Request, res:Response) =>{
      const { filter, student_id } = req.body || {};
      const serviceResponse = await serviceService.getSessionsList(filter, student_id);
      return handleServiceResponse(serviceResponse, res);
    };

    public getOtherServicesList: RequestHandler = async(req: Request, res:Response) =>{
      const serviceResponse = await serviceService.getOtherServicesList();
      return handleServiceResponse(serviceResponse, res);
    };

  public assignMentor: RequestHandler = async (req: Request, res: Response) => {
    const { doc_based_service_id, mentor_id } = req.body || {};
    const serviceResponse = await serviceService.assignMentor(
      doc_based_service_id,
      mentor_id
    );
    return handleServiceResponse(serviceResponse, res);
  };

  public submitAnswer: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await serviceService.submitAnswer(req);
    return handleServiceResponse(serviceResponse, res);
  };

  public deleteAssignment: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    const serviceResponse = await serviceService.deleteAssignment(req);
    return handleServiceResponse(serviceResponse, res);
  };

  public deleteSession: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    const serviceResponse = await serviceService.deleteSession(req);
    return handleServiceResponse(serviceResponse, res);
  };

    public getServiceDetails: RequestHandler = async (req: Request, res: Response) => {
      const serviceId = parseInt(req.params.id);
      console.log("Service details for service",serviceId);
      if (isNaN(serviceId)) {
        return res.status(400).json({ message: "Invalid service ID" });
      }
    
      const serviceResponse = await serviceService.getServiceDetails(serviceId);
      return handleServiceResponse(serviceResponse, res);
    };

    public updateStatus: RequestHandler = async (req: Request, res: Response) => {
      const serviceResponse = await serviceService.updateStatus(req);
      return handleServiceResponse(serviceResponse, res);
    };
    public addPayment: RequestHandler = async (req: Request, res: Response) => {
      const serviceResponse = await serviceService.addPayment(req);
      return handleServiceResponse(serviceResponse, res);
    };
}

export const serviceController = new ServiceController();
