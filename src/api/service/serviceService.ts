import { StatusCodes } from "http-status-codes";
import notificationQueue from "@/notifications/queue";
import type {
  DocumentBasedService,
  GetAssignmentListFilter,
  Service,
} from "@/api/service/serviceModel";
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
      return ServiceResponse.failure(
        "An error occurred during fetching services",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getServicesForNavbar(): Promise<ServiceResponse<Service[] | null>> {
    try {
      const services = await this.serviceRepository.getServicesForNavbar();
      return ServiceResponse.success<Service[]>("Services found", services);
    } catch (e) {
      const errorMessage = `Error occured during fetching services: ${e}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred during fetching services",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async addService(request: any) {
    try {
      const service = await this.serviceRepository.getServiceById(
        parseInt(request.body.serviceId)
      );
      if (!service) {
        return ServiceResponse.failure(
          "Service not found",
          null,
          StatusCodes.NOT_FOUND
        );
      }

      if (service.category === "Document Based") {
        const docPath = request.file ? request.file.path : null;
        const { studentId, subject, serviceId, description, dueDate } =
          request.body;
        const result=await this.serviceRepository.addDocumentBasedService(
          studentId,
          subject,
          serviceId,
          docPath,
          description,
          dueDate
        );
       
        /* await notificationQueue.add("sendNotification", {
        type: "ASSIGNMENT_SUBMITTED_ADMIN",
        recipientRole: "Admin",
        params: {
          "%studentName%": result.student_name,
          "%studentEmail%":result.student_email,
        },
      });

      await notificationQueue.add("sendNotification", {
        type: "ASSIGNMENT_SUBMITTED_STUDENT",
        userId: studentId,
        params: {
          "%studentName%": result.student_name,
        },
      }); */

      } else if (service.category === "Session Based") {
        const {
          studentId,
          subject,
          serviceId,
          scheduledTime,
          duration,
          link,
          payment_id,
        } = request.body;
        await this.serviceRepository.addSessionBasedService(
          studentId,
          subject,
          serviceId,
          scheduledTime,
          duration,
          link,
          payment_id
        );
        const result = await this.serviceRepository.getUserName(
          request.body.studentId
        );

       /*  await notificationQueue.add("sendNotification", {
          type: "SERVICE_ADDED_STUDENT",
          userId: request.body.studentId,
          params: {
            "%studentName%": result.student_name,
            "%serviceName%": service.service_type,
            "%time%": scheduledTime,
            "%duration%": duration,
            "%topic%": subject,
          },
        });
        await notificationQueue.add("sendNotification", {
          type: "SERVICE_ADDED",
          recipientRole: "Admin",
          params: {
            "%studentName%": result.name,
            "%studentEmail%":result.email,
            "%serviceName%": service.service_type,
          },
        }); */
      } else {
        return ServiceResponse.failure(
          "Invalid service category",
          null,
          StatusCodes.BAD_REQUEST
        );
      }
      
      
      return ServiceResponse.success("Service added successfully", null);
    } catch (e) {
      logger.error(`Error adding service: ${e}`);
      return ServiceResponse.failure(
        "Failed to add service",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async adhocServiceRequest(request: any) {
    try {     
      const {
        name,
        payment_id,
      } = request.body;
      await this.serviceRepository.addAdHocService(
        name,
        payment_id
      );
      return ServiceResponse.success("Service added successfully", null);
    } catch (e) {
      logger.error(`Error adding service: ${e}`);
      return ServiceResponse.failure(
        "Failed to add service",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getAssignmentList(filter: GetAssignmentListFilter, student_id: string) {
    try {
      const assignments = await this.serviceRepository.getAssignmentList(
        filter,
        student_id
      );
      if (assignments.length > 0) {
        return ServiceResponse.success<DocumentBasedService[]>(
          "Assignments retrieved successfully.",
          assignments
        );
      } else {
        return ServiceResponse.success<DocumentBasedService[]>(
          "No assignments available for the given criteria.",
          assignments
        );
      }
    } catch (e) {
      const errorMessage = `Error occured during fetching assignments: ${e}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred during fetching assignments",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getSessionsList(filter: GetAssignmentListFilter, student_id: string) {
    try {
      const assignments = await this.serviceRepository.getSessionsList(
        filter,
        student_id
      );
      if (assignments.length > 0) {
        return ServiceResponse.success<DocumentBasedService[]>(
          "Assignments retrieved successfully.",
          assignments
        );
      } else {
        return ServiceResponse.success<DocumentBasedService[]>(
          "No assignments available for the given criteria.",
          assignments
        );
      }
    } catch (e) {
      const errorMessage = `Error occured during fetching assignments: ${e}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred during fetching assignments",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getOtherServicesList() {
    try {
      const result = await this.serviceRepository.getOtherServicesList();
      if (result.length > 0) {
        return ServiceResponse.success<DocumentBasedService[]>(
          "Adhoc services retrieved successfully.",
          result
        );
      } else {
        return ServiceResponse.success<DocumentBasedService[]>(
          "No Adhoc Services available.",result);
      }
    } catch (e) {
      const errorMessage = `Error occured during fetching adhoc services: ${e}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred during fetching ad hoc services",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async assignMentor(doc_based_service_id: number, mentor_id: number) {
    try {
      const services = await this.serviceRepository.assignMentor(
        doc_based_service_id,
        mentor_id
      );
      return ServiceResponse.success<Service[]>("Services found", services);
    } catch (e) {
      const errorMessage = `Error occured during fetching services: ${e}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred during fetching services",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async submitAnswer(req: any) {
    try {
      const { assignmentId, answer_description } = req.body;
      const answerFilePath = req.file ? req.file.path : null;

      if (!assignmentId) {
        return ServiceResponse.failure(
          "Assignment ID is required",
          null,
          StatusCodes.BAD_REQUEST
        );
      }

      const assignmentExists =
        await this.serviceRepository.checkAssignmentExists(assignmentId);
      if (!assignmentExists) {
        return ServiceResponse.failure(
          "Assignment not found",
          null,
          StatusCodes.NOT_FOUND
        );
      }

      const result = await this.serviceRepository.updateAnswer(
        assignmentId,
        answer_description,
        answerFilePath
      );
      //console.log("Result", result);
      /* await notificationQueue.add("sendNotification", {
        type: "ASSIGNMENT_ANSWERED",
        userId: result.student_id,
        params: {
          "%studentName%": result.name,
        },
      }); */
      return ServiceResponse.success("Answer submitted successfully.", result);

      /* return ServiceResponse.success("Answer submitted successfully."); */
    } catch (error) {
      logger.error(`Error in submitAnswer: ${error}`);
      return ServiceResponse.failure(
        "An error occurred while submitting the answer",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteAssignment(req: any) {
    const { id } = req.body;
    try {
      if (!id) {
        return ServiceResponse.failure(
          "Assignment ID is required.",
          null,
          StatusCodes.BAD_REQUEST
        );
      }
      const assignmentExists =
        await this.serviceRepository.checkAssignmentExists(id);
      if (!assignmentExists) {
        return ServiceResponse.failure(
          "Assignment not found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      const deleted = await this.serviceRepository.deleteAssignment(id);

      if (deleted) {
        return ServiceResponse.success(
          "Assignment deleted successfully.",
          deleted
        );
      } else {
        return ServiceResponse.failure(
          "Assignment not found or already deleted.",
          null,
          StatusCodes.NOT_FOUND
        );
      }
    } catch (e) {
      logger.error(`Error deleting assignment: ${e}`);
      return ServiceResponse.failure(
        "An error occurred while deleting assignment.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteSession(req: any) {
    const { id } = req.body;
    try {
      if (!id) {
        return ServiceResponse.failure(
          "Assignment ID is required.",
          null,
          StatusCodes.BAD_REQUEST
        );
      }
      const assignmentExists = await this.serviceRepository.checkSessionExists(
        id
      );
      if (!assignmentExists) {
        return ServiceResponse.failure(
          "Assignment not found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      const deleted = await this.serviceRepository.deleteSession(id);

      if (deleted) {
        return ServiceResponse.success(
          "Assignment deleted successfully.",
          deleted
        );
      } else {
        return ServiceResponse.failure(
          "Assignment not found or already deleted.",
          null,
          StatusCodes.NOT_FOUND
        );
      }
    } catch (e) {
      logger.error(`Error deleting assignment: ${e}`);
      return ServiceResponse.failure(
        "An error occurred while deleting assignment.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getServiceDetails(serviceId: number): Promise<ServiceResponse<any>> {
    try {
      const [
        metadata,
        details,
        steps,
        guarantees,
        bonuses,
        universitySection,
        universities,
        assignmentHelp,
      ] = await Promise.all([
        this.serviceRepository.getServiceMetadata(serviceId),
        this.serviceRepository.getServiceDetails(serviceId),
        this.serviceRepository.getServiceSteps(serviceId),
        this.serviceRepository.getGuaranteeSections(serviceId),
        this.serviceRepository.getBonuses(serviceId),
        this.serviceRepository.getUniversitySection(serviceId),
        this.serviceRepository.getUniversities(serviceId),
        this.serviceRepository.getAssignmentHelpContent(serviceId),
      ]);

      const result = {
        metadata,
        details,
        steps,
        guaranteeSections: guarantees.map((g: any) => ({
          ...g,
          icon: `<${g.icon_name} />`,
        })),
        bonuses: bonuses.map((b: any) => ({
          ...b,
          icon: `<${b.icon_name} className="custom-icon" />`,
        })),
        universitySections: {
          ...universitySection,
          universities,
        },
        assignmentHelpContent: assignmentHelp,
      };

      return ServiceResponse.success(
        "Service details fetched successfully",
        result
      );
    } catch (e) {
      const errorMessage = `Error fetching service details: ${e}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateStatus(req: any) {
    const { id, isApproved } = req.body;
    try {
      if (!id) {
        return ServiceResponse.failure(
          "Assignment ID is required.",
          null,
          StatusCodes.BAD_REQUEST
        );
      }
      const assignmentExists = await this.serviceRepository.checkSessionExists(
        id
      );
      if (!assignmentExists) {
        return ServiceResponse.failure(
          "Assignment not found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      const result = await this.serviceRepository.updateStatus(id, isApproved);

      if (result) {
        return ServiceResponse.success(
          "Service status updated successfully!.",
          result
        );
      } else {
        return ServiceResponse.failure(
          "Service not found!",
          null,
          StatusCodes.NOT_FOUND
        );
      }
    } catch (e) {
      logger.error(`Error in updating the status: ${e}`);
      return ServiceResponse.failure(
        "An error occurred while updating the status.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async addPayment(req: any): Promise<ServiceResponse<any>> {
    const { studentId, paymentId, amount } = req.body;
    try {
      const result = await this.serviceRepository.insertPaymentHistory(
        studentId,
        paymentId,
        amount
      );
      return ServiceResponse.success(
        "Payment record added successfully",
        result
      );
    } catch (e) {
      logger.error(`Error inserting payment history: ${e}`);
      return ServiceResponse.failure(
        "Failed to insert payment record",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const serviceService = new ServiceService();
