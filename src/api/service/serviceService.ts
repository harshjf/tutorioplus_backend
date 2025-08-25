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
  
  private formatTimeForNotification(input: string): string {
    if (!input) return "";
    const ampmMatch = input.match(/(\d{1,2}):(\d{2})(?::\d{2})?\s*([AaPp][Mm])/);
    if (ampmMatch) {
      const hour = parseInt(ampmMatch[1], 10);
      const minutes = ampmMatch[2];
      const meridiem = ampmMatch[3].toUpperCase();
      const hour12 = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
      return `${String(hour12).padStart(2, "0")}:${minutes} ${meridiem}`;
    }
    let timePart = input;
    if (input.includes("T")) {
      timePart = input.split("T")[1];
    } else if (input.includes(" ")) {
      const parts = input.split(" ");
      timePart = parts[parts.length - 1];
    }
    timePart = timePart.replace(/Z|[+-]\d{2}:?\d{2}$/i, "").trim();
    const [hhStr, mmStr] = timePart.split(":");
    if (!hhStr || !mmStr) return input;
    const hours24 = parseInt(hhStr, 10);
    const minutes = mmStr.padStart(2, "0");
    if (isNaN(hours24)) return input;
    const isPM = hours24 >= 12;
    const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
    return `${String(hours12).padStart(2, "0")}:${minutes} ${isPM ? "PM" : "AM"}`;
  }

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
      console.log("service", service);
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
        console.log("document based service",result);
        await notificationQueue.add("sendNotification", {
        type: "ASSIGNMENT_SUBMITTED_ADMIN",
        recipientRole: "Admin",
        params: {
          "%studentName%": result.student_name,
          "%studentEmail%":result.student_email,
          "%country%":result.student_country
        },
      });

      await notificationQueue.add("sendNotification", {
        type: "ASSIGNMENT_SUBMITTED_STUDENT",
        userId: studentId,
        params: {
          "%studentName%": result.student_name,
        },
      });

      } else if (service.category === "Session Based") {
        const {
          studentId,
          subject,
          serviceId,
          scheduledTime,
          duration,
          link,
          payment_id,
          countryCode,
        } = request.body;
        await this.serviceRepository.addSessionBasedService(
          studentId,
          subject,
          serviceId,
          scheduledTime,
          duration,
          link,
          payment_id,
          countryCode
        );
        const result = await this.serviceRepository.getUserName(
          request.body.studentId
        );
         if (service.service_type.includes("Counselling")) {
          console.log("counselling service",result);
          await notificationQueue.add("sendNotification", {
            type: "COUNSELLING_REQUEST_ADDED_STUDENT",
            userId: request.body.studentId,
            params: {
              "%studentName%": result.name
            },
          });
          await notificationQueue.add("sendNotification", {
            type: "COUNSELLING_REQUEST_ADDED",
            recipientRole: "Admin",
            params: {
              "%studentName%": result.name,
              "%country%": result.country
            },
          });
          
        } else {
          console.log("session based service result",result);
          console.log("session based service name",service.service_type.replace(" Request", ""));
          console.log("session based service time",this.formatTimeForNotification(scheduledTime));
          console.log("session based service duration",duration.toString().includes('Min') ? duration : `${duration}Min`);
          console.log("session based service subject",subject);
          await notificationQueue.add("sendNotification", {
            type: "SERVICE_ADDED_STUDENT",
            userId: request.body.studentId,
            params: {
              "%studentName%": result.name,
              "%serviceName%": service.service_type.replace(" Request", ""), 
              "%time%": this.formatTimeForNotification(scheduledTime),
              "%duration%": duration.toString().includes('Min') ? duration : `${duration}Min`,
              "%topic%": subject,
            },
          });
          await notificationQueue.add("sendNotification", {
            type: "SERVICE_ADDED",
            recipientRole: "Admin",
            params: {
              "%studentName%": result.name,
              "%studentEmail%":result.email,
              "%country%":result.country,
              "%serviceName%": service.service_type.replace(" Request", ""),            
            },
          }); 
        }       
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

  async getCounsellingList(filter: GetAssignmentListFilter, student_id: string) {
    try {
      const counsellingSessions = await this.serviceRepository.getCounsellingList(
        filter,
        student_id
      );
      if (counsellingSessions.length > 0) {
        return ServiceResponse.success<DocumentBasedService[]>(
          "Counselling sessions retrieved successfully.",
          counsellingSessions
        );
      } else {
        return ServiceResponse.success<DocumentBasedService[]>(
          "No counselling sessions available for the given criteria.",
          counsellingSessions
        );
      }
    } catch (e) {
      const errorMessage = `Error occured during fetching counselling sessions: ${e}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred during fetching counselling sessions",
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
      await notificationQueue.add("sendNotification", {
        type: "ASSIGNMENT_ANSWERED",
        userId: result.student_id,
        params: {
          "%studentName%": result.name,
        },
      });
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
