import { StatusCodes } from "http-status-codes";
import type { GetGrievanceListFilter, Grievance } from "@/api/grievance/grievanceModel";
import { GrievanceRepository } from "@/api/grievance/grievanceRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";

class GrievanceService {
  private grievanceRepository: GrievanceRepository;

  constructor(repository: GrievanceRepository = new GrievanceRepository()) {
    this.grievanceRepository = repository;
  }

  async getAllGrievances(filter:GetGrievanceListFilter,student_id:string): Promise<ServiceResponse<Grievance[] | null>> {
    try {
      const grievances = await this.grievanceRepository.getAllGrievances(filter,student_id);
      return ServiceResponse.success<Grievance[]>("Grievances found", grievances);
    } catch (e) {
      const errorMessage = `Error occurred while fetching grievances: ${e}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while fetching grievances",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async addGrievance(studentId:number,serviceId:number,description:string): Promise<ServiceResponse<Grievance | null>>{
    try {
      const grievance = await this.grievanceRepository.addGrievance(studentId,serviceId,description);
      return ServiceResponse.success<Grievance>("Grievance added successfully", grievance);
    } catch (e) {
      const errorMessage = `Error occurred while creating grievance: ${e}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("An error occurred while adding grievance",null,StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export const grievanceService = new GrievanceService();
