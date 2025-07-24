import type {
  DocumentBasedService,
  GetAssignmentListFilter,
  Service,
  SessionBasedService,
} from "@/api/service/serviceModel";
import { query } from "@/common/models/database";
import fs from "fs/promises";
import mime from "mime-types";

export class ServiceRepository {
  async getAllServices(): Promise<Service[]> {
    const sql =
      "SELECT *, LOWER(REPLACE(service_type, ' ', '-')) AS navbar_url FROM services";
    const result = await query(sql);
    return result;
  }
  async getServicesForNavbar(): Promise<Service[]> {
    const sql =
      "SELECT *, LOWER(REPLACE(service_type, ' ', '-')) AS navbar_url  FROM services WHERE show_in_navbar = TRUE  ORDER BY position;";
    const result = await query(sql);
    return result;
  }
  async getServiceById(serviceId: number): Promise<Service> {
    const sql = "SELECT * FROM services where id=$1";
    const result = await query(sql, [serviceId]);
    return result[0];
  }
  async addDocumentBasedService(
    studentId: number,
    subject: string | null,
    serviceId: number,
    docPath: string,
    description: string,
    dueDate: Date
  ) {
    let sql: string;
    let values: any[];
    if (subject !== null && subject !== undefined) {
      sql = `
         WITH inserted AS (
        INSERT INTO document_based_services(
          student_id, subject, service_id, doc_path, description, due_date
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      )
      SELECT 
        inserted.*, 
        u.name AS student_name, 
        u.email AS student_email,
        sm.country AS student_country
      FROM inserted
      JOIN users u ON inserted.student_id = u.id
      LEFT JOIN student_metadata sm ON u.id = sm.user_id;
        `;
      values = [studentId, subject, serviceId, docPath, description, dueDate];
    } else {
      sql = `
        WITH inserted AS (
        INSERT INTO document_based_services(
          student_id, service_id, doc_path, description, due_date
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      )
     SELECT 
        inserted.*, 
        u.name AS student_name, 
        u.email AS student_email,
        sm.country AS student_country
      FROM inserted
      JOIN users u ON inserted.student_id = u.id
      LEFT JOIN student_metadata sm ON u.id = sm.user_id;
        `;
      values = [studentId, serviceId, docPath, description, dueDate];
    }
    const result = await query(sql, values);
    return result[0];
    }      
    async addSessionBasedService(
      studentId: number,
      subject: string,
      serviceId: number,
      scheduledTime: string,
      duration: string,
      link: string,
      payment_id: string,
      timeZone: string
    ): Promise<SessionBasedService> {
        const sql = "INSERT INTO session_based_services(student_id, subject, service_id, schedule_time, duration, link, payment_id, timezone) VALUES($1, $2, $3, $4, $5, $6, $7, $8) returning *";
        const result = await query(sql, [studentId, subject, serviceId, scheduledTime, duration, link, payment_id, timeZone]);
        return result;
    }
    async addAdHocService(name:string, payment_id:string): Promise<SessionBasedService>{
      const sql="INSERT INTO adhoc_services(name,payment_id) VALUES($1,$2) returning *";
      const result=await query(sql,[name,payment_id]);
      return result;
  }
    async getAssignmentList(filter:GetAssignmentListFilter, student_id:string){
        let sql = `
         SELECT 
            dbs.id,
            dbs.student_id,
            u.name AS student_name,  
            dbs.subject,
            dbs.mentor_id,
            dbs.service_id,
            s.service_type AS service_name,
            dbs.doc_path,
            dbs.description,
            dbs.answer_file_path,
            dbs.answer_description,
            dbs.answer_submitted_at,
            dbs.due_date,
            dbs.created_at,
            dbs.updated_at
        FROM document_based_services dbs
        JOIN users u ON dbs.student_id = u.id
        JOIN services s ON dbs.service_id=s.id
        WHERE dbs.active = true
        `;
    const conditions: string[] = [];
    const values: any[] = [];
    if (filter) {
      if (filter.name) {
        conditions.push(`u.name ILIKE $${values.length + 1}`);
        values.push(`%${filter.name}%`);
      }
      if (filter.description) {
        conditions.push(`dbs.description ILIKE $${values.length + 1}`);
        values.push(`%${filter.description}%`);
      }
      if (filter.due_date) {
        const formattedDate = new Date(filter.due_date)
          .toISOString()
          .split("T")[0];
        conditions.push(`dbs.due_date::DATE = $${values.length + 1}`);
        values.push(formattedDate);
      }
      if (filter.services) {
        const serviceIds = filter.services
          .replace(/&comma;/g, ",")
          .split(",")
          .map(Number);

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
      sql += ` AND ` + conditions.join(" AND ");
    }

    const result = await query(sql, values);
    for (const item of result) {
      if (item.doc_path) {
        try {
          const fileBuffer = await fs.readFile(item.doc_path);
          item.doc_base64 = fileBuffer.toString("base64");
          item.doc_mimetype =
            mime.lookup(item.doc_path) || "application/octet-stream";
        } catch (error) {
          console.error(`Error reading file ${item.doc_path}:`, error);
          item.doc_base64 = null;
          item.doc_mimetype = null;
        }
      } else {
        item.doc_base64 = null;
        item.doc_mimetype = null;
      }
      if (item.answer_file_path) {
        try {
          const answerBuffer = await fs.readFile(item.answer_file_path);
          item.answer_base64 = answerBuffer.toString("base64");
          item.answer_mimetype =
            mime.lookup(item.answer_file_path) || "application/octet-stream";
        } catch (error) {
          console.error(`Error reading file ${item.answer_file_path}:`, error);
          item.answer_base64 = null;
          item.answer_mimetype = null;
        }
      } else {
        item.answer_base64 = null;
        item.answer_mimetype = null;
      }
    }
    return result;
  }
  async getSessionsList(filter: GetAssignmentListFilter, student_id: string) {
    let sql = `
         SELECT 
        sbs.id,
        sbs.student_id,
        u.name AS student_name,  
        sbs.service_id,
        u.email AS student_email,
        sm.phone_number AS student_phone,
        sm.country_code AS country_code,
        sbs.schedule_time,
        sbs.duration,
        sbs.subject,
        s.service_type AS service_name,
        sbs.status,
        sbs.created_at,
        sbs.updated_at,
        sbs.country_code
    FROM session_based_services sbs
    JOIN users u ON sbs.student_id = u.id
    JOIN student_metadata sm ON sm.user_id = u.id
    JOIN services s ON sbs.service_id = s.id
    WHERE sbs.active = true
      AND sbs.service_id NOT IN (
          SELECT id FROM services WHERE service_type = 'Others'
      )
        `;
        const conditions: string[] = [];
        const values: any[] = [];
        if(filter){
            if (filter.name) {
                conditions.push(`u.name ILIKE $${values.length + 1}`);
                values.push(`%${filter.name}%`);
            }
            if (filter.description) {
                conditions.push(`sbs.description ILIKE $${values.length + 1}`);
                values.push(`%${filter.description}%`);
            }
            if (filter.due_date) {
                const formattedDate = new Date(filter.due_date).toISOString().split('T')[0];
                conditions.push(`sbs.due_date::DATE = $${values.length + 1}`);           
                values.push(formattedDate);
            }
            if (filter.services) {
                const serviceIds = filter.services.replace(/&comma;/g, ',').split(',').map(Number);
                
                if (serviceIds.length > 0) {
                    conditions.push(`sbs.service_id = ANY($${values.length + 1})`);
                    values.push(serviceIds);
                }
            }
        }
        if (student_id) {
            conditions.push(`sbs.student_id = $${values.length + 1}`);
            values.push(student_id);
        }
        if (conditions.length > 0) {
            sql += ` AND ` + conditions.join(' AND ');
        }

        const result = await query(sql, values);
        return result;
    }
    async getOtherServicesList(){
        let sql = `
         SELECT name,payment_id from adhoc_services;
        `;

        const result = await query(sql);
        return result;
    }
    async assignMentor(doc_based_service_id:number, mentor_id:number){
        const sql = `
            UPDATE document_based_services
            SET mentor_id = $2,
                updated_at = NOW() 
            WHERE id = $1;`;
    const values = [doc_based_service_id, mentor_id];
    const result = await query(sql, values);
    return result;
  }
  async checkAssignmentExists(id: number) {
    const sql = `SELECT id FROM document_based_services WHERE id = $1`;
    const result = await query(sql, [id]);
    return result.length > 0;
  }
  async checkSessionExists(id: number) {
    const sql = `SELECT id FROM session_based_services WHERE id = $1`;
    const result = await query(sql, [id]);
    return result.length > 0;
  }
  async updateAnswer(
    id: number,
    answer_description: string,
    answer_file_path: string | null
  ) {
    const sql = `
         WITH updated AS (
         UPDATE document_based_services 
         SET 
            answer_description = $1, 
            answer_file_path = $2, 
            answer_submitted_at = NOW(),
            updated_at = NOW() 
        WHERE id = $3 RETURNING * )
        SELECT updated.*, u.name AS name FROM updated JOIN users u ON u.id = updated.student_id;
        `;
    const result=await query(sql, [answer_description, answer_file_path, id]);
    return result[0];
  }
  async deleteAssignment(id: number) {
    const sql = `
          UPDATE document_based_services 
          SET active = FALSE
          WHERE id = $1 
          returning *
        `;

    const result = await query(sql, [id]);
    return result[0];
  }
  async deleteSession(id: number) {
    const sql = `
          UPDATE session_based_services 
          SET active = FALSE
          WHERE id = $1 
          returning *
        `;

    const result = await query(sql, [id]);
    return result[0];
  }
  async getServiceMetadata(serviceId: number) {
    const sql = `SELECT * FROM service_metadata WHERE service_id = $1`;
    const result = await query(sql, [serviceId]);
    return result[0] || null;
  }
  async getServiceDetails(serviceId: number) {
    const sql = `SELECT * FROM service_details WHERE service_id = $1`;
    const result = await query(sql, [serviceId]);
    return result[0] || null;
  }
  async getServiceSteps(serviceId: number) {
    const sql = `SELECT * FROM service_steps WHERE service_id = $1`;
    const result = await query(sql, [serviceId]);
    return result[0] || null;
  }
  async getGuaranteeSections(serviceId: number) {
    const sql = `SELECT * FROM guarantee_sections WHERE service_id = $1`;
    return await query(sql, [serviceId]);
  }
  async getBonuses(serviceId: number) {
    const sql = `SELECT * FROM bonuses WHERE service_id = $1`;
    return await query(sql, [serviceId]);
  }
  async getUniversitySection(serviceId: number) {
    const sql = `SELECT * FROM university_sections WHERE service_id = $1`;
    const result = await query(sql, [serviceId]);
    return result[0] || null;
  }
  async getUniversities(serviceId: number) {
    const sql = `SELECT u.* FROM universities u
                     INNER JOIN university_sections us ON u.university_section_id = us.id
                     WHERE us.service_id = $1`;
        return await query(sql, [serviceId]);
    }     
    async getAssignmentHelpContent(serviceId: number) {
        const sql = `SELECT * FROM assignment_help_content WHERE service_id = $1`;
        const result = await query(sql, [serviceId]);
        return result[0] || null;
    }  
    async updateStatus(id: number, isApproved: any) {
        const isApprovedStr = String(isApproved).toLowerCase();
        const status = isApprovedStr === "true" || isApproved === true ? "Approved" : "Rejected";
        
        const sql = `
          UPDATE session_based_services
          SET status = $2
          WHERE id = $1 
          returning *
        `;
        
        const result = await query(sql, [id, status]);
        return result[0];
    }  
    async insertPaymentHistory(studentId: number | undefined, paymentId: string, amount: number) {
        const sql = `
          INSERT INTO payment_history (student_id, payment_id, amount)
          VALUES ($1, $2, $3)
          RETURNING *;
        `;
        const result = await query(sql, [studentId || null, paymentId, amount]);
        return result[0];
      }
    async getUserName (id:number){
        const sql="SELECT name,email,sm.country FROM users u LEFT JOIN student_metadata sm ON u.id = sm.user_id WHERE u.id=$1";
        const result=await query(sql,[id]);
        return result[0];
      }  

}
