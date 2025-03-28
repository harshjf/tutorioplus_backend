import type { City, Country, getMentorFilter, getStudentFilter, State, User } from "@/api/user/userModel";
import {query} from "@/common/models/database";
import { stat } from "fs";
import fs from 'fs/promises';
import mime from "mime";

export class UserRepository {
  async findAllAsync(){
    const sql = "SELECT * FROM users WHERE active=true";
    const result= await query(sql);
    return result;
  }
  async isTokenValid(token:string){
    const sql="SELECT * FROM reset_password WHERE token=$1";
    const result=await query(sql,[token]);
    return result[0];
  }
  async findByEmailAsync(email:string){
    const sql=`SELECT u.*, r.role 
        FROM users u
        JOIN roles r ON u.role_id = r.id
        WHERE u.email = $1 AND u.active = true`;
    const result=await query(sql,[email]);
    return result[0];
  }
  async signUp(name:string,email:string,password:string,role_id:number){
    const sql="INSERT INTO users (role_id, name, email, password) VALUES ($1, $2, $3, $4) RETURNING *;"
    const result=await query(sql,[role_id,name,email,password]);
    return result[0];
  }
  async getSubjects(){
    const sql="SELECT * FROM subjects ";
    const result=await query(sql);
    return result;
  }
  async getStudents(filter: getStudentFilter) {
    let sql = `  
      SELECT 
        u.id AS user_id,
        u.name AS user_name,
        u.email AS user_email,
        u.role_id AS user_role_id,
        sm.id AS metadata_id,
        sm.pincode,
        sm.address,
        sm.phone_number,
        sm.purpose_of_sign_in,
        sm.first_payment_date,
        sm.created_at AS metadata_created_at,
        sm.updated_at AS metadata_updated_at
      FROM 
        users u
      JOIN 
        student_metadata sm ON u.id = sm.user_id
      WHERE 
        u.active = true`; 
  
    const conditions: string[] = [];
    const values: any[] = [];
  
    if (filter) {
      if (filter.email) {
        conditions.push(`u.email = $${values.length + 1}`);
        values.push(`${filter.email}`);
      }
      if (filter.name) {
        conditions.push(`u.name = $${values.length + 1}`);
        values.push(`${filter.name}`);
      }
      if (filter.phone_number) {
        conditions.push(`sm.phone_number = $${values.length + 1}`);
        values.push(`${filter.phone_number}`);
      }
    }
  
    if (conditions.length > 0) {
      sql += ` AND ` + conditions.join(' AND ');
    }
  
    /* console.log("Values", values); */
    const result = await query(sql, values);
 /*    console.log("Query", sql);
    console.log("result", result); */
    return result;
  }  
  async insertMetaData(id:number,country:string,state:string,city:string,pinCode:string,purposeOfSignIn:string,firstPaymentDate:Date | null,address:string,phone:string){
    const sql="INSERT INTO student_metadata(user_id,country,state,city,pincode,purpose_of_sign_in,first_payment_date,address,phone_number) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)";
    console.log("Country,state,city")
    const result=await query(sql,[id,country,state,city,pinCode,purposeOfSignIn,firstPaymentDate,address,phone]);
    return result;
  }
  async insertMentorMetaData(id:number,phoneNumber:string,address:string,qualification:string,teachingExperience:number,jobType:string,country:string,state:string,city:string,cvPath:string){
    const sql="INSERT INTO mentor_metadata(user_id,phone_number,address,qualification,teaching_experience,job_type,cv,country,state,city) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)";
    const result=await query(sql,[id,phoneNumber,address,qualification,teachingExperience,jobType,cvPath,country,state,city]);
    return result[0];
  }
  async saveResetToken(id:number, token:string, expiryDate:Date){
    const sql="INSERT INTO reset_password(student_id,token,expires_at) VALUES($1,$2,$3)";
    const result=await query(sql,[id,token,expiryDate]);
    return result;
  }
  async resetPassword(id:number,password:string){
    try{
      const sql="UPDATE users SET password=$2 WHERE id=$1 returning *";
      const result=await query(sql,[id,password]);
      return result;
    }
   catch(e){
    console.log(`Error resetting password for user ${id}: ${e}`);
   }
  }
  async tokenUsed(id:number){
    const sql="UPDATE reset_password SET is_used=TRUE WHERE id=$1";
    const result=await query(sql,[id]);
    return result;
  }
  async editStudent(id: number, name: string, email: string) {
    const sql = "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *";
    const result = await query(sql, [name, email, id]);
    return result[0]; // Return updated user
  }
  async updateMetaData(
    id: number,
    country: string,
    state: string,
    city: string,
    pinCode: string,
    address: string,
    phone: string
  ) {
    const sql = `UPDATE student_metadata 
                SET country = $2, state = $3, city = $4, pincode = $5, 
                    address = $6, phone_number = $7 
                WHERE user_id = $1`;
    const result = await query(sql, [id, country, state, city, pinCode, address, phone]);
    return result[0];
  }
  async deactivateUser(id: number) {
    const sql = "UPDATE users SET active = false WHERE id = $1 RETURNING *";
    const result = await query(sql, [id]);
    return result[0];
  }  
  async findByIdAsync(userId: number) {
    const sql = `
      SELECT 
        u.id, u.name,u.password, u.email, u.role_id, u.created_at, u.updated_at,
        sm.country, sm.state, sm.city, sm.pincode, sm.address, sm.phone_number, 
        sm.purpose_of_sign_in, sm.first_payment_date
      FROM users u
      LEFT JOIN student_metadata sm ON u.id = sm.user_id
      WHERE u.id = $1 AND u.active = true
    `;
    
    const result = await query(sql, [userId]);
    return result.length ? result[0] : null;
  }
  async getMentors(filter: getMentorFilter) {
    let sql = `  
      SELECT 
        u.id AS user_id,
        u.name AS user_name,
        u.email AS user_email,
        u.role_id AS user_role_id,
        mm.id AS metadata_id,
        mm.phone_number,
        mm.address,
        mm.qualification,
        mm.teaching_experience,
        mm.job_type,
        mm.cv,
        mm.country,
        mm.state,
        mm.city
      FROM 
        users u
      JOIN 
        mentor_metadata mm ON u.id = mm.user_id
      WHERE 
        u.active = true`; 
  
    const conditions: string[] = [];
    const values: any[] = [];
  
    if (filter) {
      if (filter.email) {
        conditions.push(`u.email = $${values.length + 1}`);
        values.push(`${filter.email}`);
      }
      if (filter.name) {
        conditions.push(`u.name = $${values.length + 1}`);
        values.push(`${filter.name}`);
      }
      if (filter.phone_number) {
        conditions.push(`mm.phone_number = $${values.length + 1}`);
        values.push(`${filter.phone_number}`);
      }
    }
  
    if (conditions.length > 0) {
      sql += ` AND ` + conditions.join(' AND ');
    }
    const result = await query(sql, values);

    for (const mentor of result) {
      if (mentor.cv) {
          try {
              const fileBuffer = await fs.readFile(mentor.cv);
              mentor.cv_base64 = fileBuffer.toString('base64');

              // Extract MIME type
              const mimeType = mime.lookup(mentor.cv) || 'application/octet-stream';
              mentor.cv_mimetype = mimeType;

          } catch (error) {
              console.error(`Error reading file ${mentor.cv}:`, error);
              mentor.cv_base64 = null;
              mentor.cv_mimetype = null;
          }
      } else {
          mentor.cv_base64 = null;
          mentor.cv_mimetype = null;
      }
  }
    return result;
  }  
  async editMentor(id: number, name: string, email: string) {
    const sql = "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *";
    const result = await query(sql, [name, email, id]);
    return result[0]; 
  }
  async updateMentorMetaData(
    id: number,
    cv: string | null,
    phoneNumber: string,
    address: string,
    qualification: string,
    teachingExperience: string,
    jobType: string,
    country: string,
    state: string,
    city: string
  ) {
    let sql = `UPDATE mentor_metadata SET `;
    const params: any[] = [];
    
    if (cv !== null && cv !== "") {
      sql += `cv = $${params.length + 1}, `;
      params.push(cv);
    }
  
    sql += `phone_number = $${params.length + 1}, address = $${params.length + 2}, 
            qualification = $${params.length + 3}, teaching_experience = $${params.length + 4}, 
            job_type = $${params.length + 5}, country = $${params.length + 6}, 
            state = $${params.length + 7}, city = $${params.length + 8} 
            WHERE user_id = $${params.length + 9}`;
  
    params.push(phoneNumber, address, qualification, teachingExperience, jobType, country, state, city, id);
  
    const result = await query(sql, params);
    return result[0];
  }
  async approveTutor(approve:boolean, id:number){
    console.log("Approve id",approve,id);
    const sql="UPDATE mentor_metadata SET approve=$1 WHERE user_id=$2 RETURNING *";
    const result= await query(sql,[approve,id]);
    return result[0];
  }
  async updatePassword(id: number, newPassword: string) {
    console.log("id",id,newPassword);
    const sql = `UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2`;
    await query(sql, [newPassword, id]);
  }
  async getTotalStudents(): Promise<number> {
    const sql = `
      SELECT COUNT(*) FROM users WHERE role_id = ( SELECT id FROM roles WHERE LOWER(role) = LOWER('Student'));
    `;
    const result = await query(sql);
    return parseInt(result[0].count, 10);
  }  
  async getAssignmentsAnswered(): Promise<number> {
    const sql = `
      SELECT COUNT(*) FROM document_based_services 
      WHERE answer_file_path IS NOT NULL
    `;
    const result = await query(sql);
    return parseInt(result[0].count, 10);
  }  
  async getTotalAssignments(): Promise<number> {
    const sql = `SELECT COUNT(*) FROM document_based_services`;
    const result = await query(sql);
    return parseInt(result[0].count, 10);
  }  
  async getOnlineClassesRequested(): Promise<number> {
    const sql = `
      SELECT COUNT(*) FROM session_based_services sbs
      JOIN services s ON s.id = sbs.service_id
      WHERE s.service_type = 'Online Class Request'
    `;
    const result = await query(sql);
    return parseInt(result[0].count, 10);
  }
  async getAssignmentActivity(range: "week" | "month" | "year"): Promise<{ labels: string[], counts: number[] }> {
    let sql = "";
    let labels: string[] = [];
    let counts: number[] = [];
  
    if (range === "week") {
      sql = `
        SELECT 
        TO_CHAR(created_at, 'Dy') as day, 
        COUNT(*) 
        FROM document_based_services 
        WHERE created_at >= date_trunc('week', CURRENT_DATE)
        GROUP BY TO_CHAR(created_at, 'Dy')
        ORDER BY array_position(ARRAY['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], TO_CHAR(created_at, 'Dy'))
      `;
      labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    } else if (range === "month") {
      sql = `
        SELECT 
        TO_CHAR(created_at, 'Mon') AS month, 
        COUNT(*) 
        FROM document_based_services 
        WHERE date_part('year', created_at) = date_part('year', CURRENT_DATE)
        GROUP BY TO_CHAR(created_at, 'Mon')
        ORDER BY array_position(
        ARRAY['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
        TO_CHAR(created_at, 'Mon')
        )
      `;
      labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    } else if (range === "year") {
      sql = `
        SELECT EXTRACT(YEAR FROM created_at)::TEXT AS year, COUNT(*) 
        FROM document_based_services 
        GROUP BY year 
        ORDER BY year
      `;
    }
  
    const result = await query(sql);
  
    if (range === "year") {
      labels = result.map((r: any) => r.year);
      counts = result.map((r: any) => parseInt(r.count));
    } else {
      const countMap: Record<string, number> = {};
      for (const row of result) {
        countMap[row.day || row.month] = parseInt(row.count);
      }
      counts = labels.map(label => countMap[label] || 0);
    }
  
    return { labels, counts };
  }
  async getNotificationsWithCount(userId: number, offset: number, limit: number): Promise<{ total: number, notifications: any[] }> {
    const sql = `
      SELECT
        id,
        user_id,
        title,
        message,
        created_at,
        COUNT(*) OVER() AS total_count
      FROM user_notifications
      WHERE user_id = $1
      ORDER BY created_at DESC
      OFFSET $2 LIMIT $3
    `;
  
    const result = await query(sql, [userId, offset, limit]);
  
    const total = result.length > 0 ? parseInt(result[0].total_count) : 0;
    const notifications = result.map((row: any) => {
      const { total_count, ...rest } = row;
      return rest;
    });
  
    return { total, notifications };
  }
  
}
