import type { Grievance } from "@/api/grievance/grievanceModel";
import { query } from "@/common/models/database";

export class GrievanceRepository {
  async getAllGrievances(): Promise<Grievance[]> {
    const sql = `SELECT * FROM grievances `;
    const result = await query(sql);
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
