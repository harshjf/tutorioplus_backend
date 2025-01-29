import type { DocumentBasedService, GetAssignmentListFilter, Service, SessionBasedService } from "@/api/service/serviceModel";
import {query} from "@/common/models/database";
import fs from 'fs/promises';

export class ServiceRepository {
    async getAllServices(): Promise<Service[]> {
      const sql = "SELECT * FROM services";
      const result= await query(sql);
      return result;
    }
    async getServiceById(serviceId: number): Promise<Service>{
        const sql="SELECT * FROM services where id=$1";
        const result=await query(sql,[serviceId]);
        return result[0];
    }
    async addDocumentBasedService(
        studentId: number,
        subjectId: number | null, 
        serviceId: number,
        docPath: string,
        description: string,
        dueDate: Date
    ): Promise<DocumentBasedService> {
    let sql: string;
    let values: any[];
            
    if (subjectId !== null && subjectId !== undefined) {
        sql = `
        INSERT INTO document_based_services(
            student_id, subject_id, service_id, doc_path, description, due_date
        )
        VALUES($1, $2, $3, $4, $5, $6) 
        RETURNING *;
        `;
        values = [studentId, subjectId, serviceId, docPath, description, dueDate];
    } else {
        sql = `
        INSERT INTO document_based_services(
            student_id, service_id, doc_path, description, due_date
        )
        VALUES($1, $2, $3, $4, $5) 
        RETURNING *;
        `;
        values = [studentId, serviceId, docPath, description, dueDate];
    }
    const result = await query(sql, values);
    return result;
    }      
    async addSessionBasedService(studentId:number,serviceId:number,scheduledTime:string,duration:string,link:string): Promise<SessionBasedService>{
        const sql="INSERT INTO session_based_services(student_id,service_id,schedule_time,duration,link) VALUES($1,$2,$3,$4,$5) returning *";
        const result=await query(sql,[studentId,serviceId,scheduledTime,duration,link]);
        return result;
    }
    async getAssignmentList(filter:GetAssignmentListFilter, student_id:string){
        let sql = `
         SELECT 
            dbs.id,
            dbs.student_id,
            u.name AS student_name,  
            dbs.subject_id,
            dbs.mentor_id,
            dbs.service_id,
            s.service_type AS service_name,
            dbs.doc_path,
            dbs.description,
            dbs.due_date,
            dbs.created_at,
            dbs.updated_at
        FROM document_based_services dbs
        JOIN users u ON dbs.student_id = u.id
        JOIN services s ON dbs.service_id=s.id
        `;
        const conditions: string[] = [];
        const values: any[] = [];
        if(filter){
            if (filter.name) {
                conditions.push(`u.name ILIKE $${values.length + 1}`);
                values.push(`%${filter.name}%`);
            }
            if (filter.description) {
                conditions.push(`dbs.description ILIKE $${values.length + 1}`);
                values.push(`%${filter.description}%`);
            }
            if (filter.due_date) {
                const formattedDate = new Date(filter.due_date).toISOString().split('T')[0];
                conditions.push(`dbs.due_date::DATE = $${values.length + 1}`);           
                values.push(formattedDate);
            }
            if (filter.services) {
                const serviceIds = filter.services.replace(/&comma;/g, ',').split(',').map(Number);
                
                if (serviceIds.length > 0) {
                    conditions.push(`dbs.service_id = ANY($${values.length + 1})`);
                    values.push(serviceIds);
                }
            }
        }
        if (student_id) {
            conditions.push(`dbs.student_id = $${values.length + 1}`);
            values.push(student_id);
        }
        if (conditions.length > 0) {
            sql += ` WHERE ` + conditions.join(' AND ');
        }

        const result = await query(sql, values);
        for (const item of result) {
            if (item.doc_path) {
                try {
                    const fileBuffer = await fs.readFile(item.doc_path);
                    item.doc_base64 = fileBuffer.toString('base64');
                } catch (error) {
                    console.error(`Error reading file ${item.doc_path}:`, error);
                    item.doc_base64 = null; 
                }
            } else {
                item.doc_base64 = null;
            }
        }
        return result;
    }
    async assignMentor(doc_based_service_id:number, mentor_id:number){
        const sql = `
            UPDATE document_based_services
            SET mentor_id = $2,
                updated_at = NOW() 
            WHERE id = $1;`;
        const values = [doc_based_service_id,mentor_id];
        const result = await query(sql, values);
        return result;
    }
}