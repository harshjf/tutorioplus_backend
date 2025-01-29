import { StatusCodes } from "http-status-codes";

import type { DocumentBasedService, GetAssignmentListFilter, Service } from "@/api/service/serviceModel";
import { ServiceRepository } from "@/api/service/serviceRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";

export class ServiceService {
    private serviceRepository: ServiceRepository;
  
    constructor(repository: ServiceRepository = new ServiceRepository()) {
      this.serviceRepository = repository;
    }
    async getAllServices(): Promise<ServiceResponse<Service[] | null>> {
        try {
          const services = await this.serviceRepository.getAllServices();
          return ServiceResponse.success<Service[]>("Services found", services);
        } catch (e) {
            const errorMessage = `Error occured during fetching services: ${e}`;
            logger.error(errorMessage);
            return ServiceResponse.failure("An error occurred during fetching services", null, StatusCodes.INTERNAL_SERVER_ERROR);
        }
      }
    
    async addService(request: any) {
       try {        
           const service = await this.serviceRepository.getServiceById(parseInt(request.body.serviceId));
           if (!service) {
               return ServiceResponse.failure("Service not found", null, StatusCodes.NOT_FOUND);
           }

          if (service.category === "Document Based") {            
            const docPath = request.file ? request.file.path : null;    
            const{studentId,subjectId,serviceId,description,dueDate}=request.body;            
            await this.serviceRepository.addDocumentBasedService(studentId,subjectId,serviceId,docPath,description,dueDate);
          } else if (service.category === "Session Based") {
            const{studentId,serviceId,scheduledTime,duration,link}=request.body;            
            await this.serviceRepository.addSessionBasedService(studentId,serviceId,scheduledTime,duration,link);
          } else {
            return ServiceResponse.failure("Invalid service category", null, StatusCodes.BAD_REQUEST);
          }   
          return ServiceResponse.success("Service added successfully", null);
        } catch (e) {
          logger.error(`Error adding service: ${e}`);
          return ServiceResponse.failure("Failed to add service", null, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async getAssignmentList(filter:GetAssignmentListFilter, student_id:string) {
      try {
        const assignments = await this.serviceRepository.getAssignmentList(filter,student_id);
        if(assignments.length>0){
          return ServiceResponse.success<DocumentBasedService[]>("Assignments retrieved successfully.", assignments);
        }else{
          return ServiceResponse.success<DocumentBasedService[]>("No assignments available for the given criteria.", assignments);
        }        
      } catch (e) {
          const errorMessage = `Error occured during fetching assignments: ${e}`;
          logger.error(errorMessage);
          return ServiceResponse.failure("An error occurred during fetching assignments", null, StatusCodes.INTERNAL_SERVER_ERROR);
      }
    }

    async assignMentor(doc_based_service_id:number, mentor_id:number){
      try {
        const services = await this.serviceRepository.assignMentor(doc_based_service_id,mentor_id);
        return ServiceResponse.success<Service[]>("Services found", services);
      } catch (e) {
          const errorMessage = `Error occured during fetching services: ${e}`;
          logger.error(errorMessage);
          return ServiceResponse.failure("An error occurred during fetching services", null, StatusCodes.INTERNAL_SERVER_ERROR);
      }
    }
}

    export const serviceService = new ServiceService();
  