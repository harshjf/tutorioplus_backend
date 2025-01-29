import type { GetGrievanceListFilter, Grievance } from "@/api/grievance/grievanceModel";
import { query } from "@/common/models/database";

export class GrievanceRepository {
  async getAllGrievances(filter:GetGrievanceListFilter, student_id:string): Promise<Grievance[]> {
    let sql = `SELECT 
      g.id AS grievance_id,
      u.name AS student_name,
      u.email AS student_email,
      sm.phone_number AS student_phone,
      s.service_type AS service_name,
      g.description,
      g.status,
      g.created_at AS created_date
      FROM 
          grievances g
      JOIN 
          users u ON g.student_id = u.id
      JOIN 
          student_metadata sm ON u.id = sm.user_id
      JOIN 
          services s ON g.service_id = s.id`;
    
    const conditions: string[] = [];
    const values: any[] = [];
      
    if (filter) {
        if (filter.student_name) {
            conditions.push(`u.name ILIKE $${values.length + 1}`);
            values.push(`%${filter.student_name}%`);
        }
      
        if (filter.student_email) {
            conditions.push(`u.email ILIKE $${values.length + 1}`);
            values.push(`%${filter.student_email}%`);
        }
      
        if (filter.student_phone) {
            conditions.push(`sm.phone_number ILIKE $${values.length + 1}`);
            values.push(`%${filter.student_phone}%`);
        }
      
        if (filter.services) {
            const serviceIds = filter.services
                .replace(/&comma;/g, ',')
                .split(',')
                .map(Number)
                .filter(id => !isNaN(id));
      
            if (serviceIds.length > 0) {
                conditions.push(`g.service_id = ANY($${values.length + 1})`);
                values.push(serviceIds);
            }
        }
      
        if (filter.description) {
            conditions.push(`g.description ILIKE $${values.length + 1}`);
            values.push(`%${filter.description}%`);
        }
      
        if (filter.status) {
            conditions.push(`g.status = $${values.length + 1}`);
            values.push(filter.status);
        }
      
        if (filter.created_at) {
            const formattedDate = new Date(filter.created_at).toISOString().split('T')[0];
            conditions.push(`g.created_at::DATE = $${values.length + 1}`);
            values.push(formattedDate);
        }
    }
    
    if (student_id) {
        conditions.push(`g.student_id = $${values.length + 1}`);
        values.push(student_id);
    } 

    if (conditions.length > 0) {
        sql += ` WHERE ` + conditions.join(' AND ');
    }

    const result = await query(sql, values);
    return result;
  }
  async addGrievance(studentId:number,serviceId:number,description:string): Promise<Grievance> {
    const sql = `
      INSERT INTO grievances (student_id, service_id, description)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const values = [studentId, serviceId, description];
    const result = await query(sql, values);
    return result[0];
  }
}
