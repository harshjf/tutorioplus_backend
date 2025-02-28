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
        u.id, u.name, u.email, u.role_id, u.created_at, u.updated_at,
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
  async updateMentorMetaData(id:number, cv:string, phoneNumber:string, address:string, qualification:string, teachingExperience:string, jobType:string, country:string, state:string, city:string){
    const sql = `UPDATE mentor_metadata 
                SET cv = $2, phone_number=$3, address=$4,
                qualification=$5, teaching_experience = $6,
                job_type=$7, country=$8, state=$9, city=$10
                WHERE user_id = $1`;
    const result = await query(sql, [id,cv,phoneNumber,address,qualification,teachingExperience,jobType,country,state,city]);
    return result[0];
  }
}
