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

  async addGrievance(studentId:number,description:string): Promise<ServiceResponse<Grievance | null>>{
    try {
      const grievance = await this.grievanceRepository.addGrievance(studentId,description);
      return ServiceResponse.success<Grievance>("Grievance added successfully", grievance);
    } catch (e) {
      const errorMessage = `Error occurred while creating grievance: ${e}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("An error occurred while adding grievance",null,StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
  async deleteGrievance(grievanceId: number): Promise<ServiceResponse<null>> {
    try {
        const grievanceExists = await this.grievanceRepository.getGrievanceById(grievanceId);
        if (!grievanceExists) {
            return ServiceResponse.failure("Grievance not found", null, StatusCodes.NOT_FOUND);
        }

        await this.grievanceRepository.softDeleteGrievance(grievanceId);
        return ServiceResponse.success("Grievance deleted successfully", null);
    } catch (e) {
        const errorMessage = `Error deleting grievance: ${e}`;
        logger.error(errorMessage);
        return ServiceResponse.failure(
            "An error occurred while deleting grievance",
            null,
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }

    
}

async markAsResolved(grievanceId: number): Promise<ServiceResponse<null>> {
  try {
      const grievanceExists = await this.grievanceRepository.getGrievanceById(grievanceId);
      if (!grievanceExists) {
          return ServiceResponse.failure("Grievance not found", null, StatusCodes.NOT_FOUND);
      }

      await this.grievanceRepository.markAsResolved(grievanceId);
      return ServiceResponse.success("Grievance marked as resolved successfully", null);
  } catch (e) {
      const errorMessage = `Error in marking the grievance as resolved: ${e}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
          "An error occurred while marking the grievance as resolved",
          null,
          StatusCodes.INTERNAL_SERVER_ERROR
      );
  }

  
}


}

export const grievanceService = new GrievanceService();
