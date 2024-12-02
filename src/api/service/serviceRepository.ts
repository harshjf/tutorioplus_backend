import type { DocumentBasedService, Service, SessionBasedService } from "@/api/service/serviceModel";
import {query} from "@/common/models/database"

export class ServiceRepository {
    async getAllServices(): Promise<Service[]> {
      const sql = "SELECT * FROM services";
      const result= await query(sql);
      return result;
    }
    async getServiceById(serviceId: number): Promise<Service>{
        const sql="SELECT * FROM services where id=$1";
        const result=await query(sql,[serviceId]);
        console.log("Result",result);
        return result[0];
    }
    async addDocumentBasedService(studentId:number,subjectId:number,serviceId:number,docPath:string,description:string,dueDate:Date): Promise<DocumentBasedService>{
        const sql="INSERT INTO document_based_services(student_id,subject_id,service_id,doc_path,description,due_date) VALUES($1,$2,$3,$4,$5,$6) returning *";
        const result=await query(sql,[studentId,subjectId,serviceId,docPath,description,dueDate]);
        return result;
    }
    async addSessionBasedService(studentId:number,serviceId:number,scheduledTime:string,duration:string,link:string): Promise<SessionBasedService>{
        const sql="INSERT INTO session_based_services(student_id,service_id,schedule_time,duration,link) VALUES($1,$2,$3,$4,$5) returning *";
        const result=await query(sql,[studentId,serviceId,scheduledTime,duration,link]);
        return result;
    }
}