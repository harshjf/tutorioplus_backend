import type { City, Country, getStudentFilter, State, User } from "@/api/user/userModel";
import {query} from "@/common/models/database"

export class UserRepository {
  async findAllAsync(){
    const sql = "SELECT * FROM users";
    const result= await query(sql);
    return result;
  }
  async isTokenValid(token:string){
    //console.log("Token",token);
    const sql="SELECT * FROM reset_password WHERE token=$1";
    const result=await query(sql,[token]);
    return result[0];
  }
  async findByEmailAsync(email:string){
    const sql="SELECT * FROM users WHERE email=$1";
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
  async getStudents(filter:getStudentFilter){
    let sql=`  SELECT 
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
        student_metadata sm ON u.id = sm.user_id`;
    const conditions: string[] = [];
    const values: any[] = [];
      
        
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
      
    if (conditions.length > 0) {
      sql += ` WHERE ` + conditions.join(' AND ');
    }
    console.log("Values",values);
    const result=await query(sql,values);
    console.log("Query",sql);
    console.log("result",result);
    return result;
  }
  async getAllCountries(){
    const sql="SELECT * FROM countries";
    const result=await query(sql);
    return result;
  }
  async getStates(id:number){
    const sql="SELECT * FROM states where country_id=$1";
    const result=await query(sql,[id]);
    return result;
  }
  async getCities(id:number){
    const sql="SELECT * FROM cities where state_id=$1";
    const result=await query(sql,[id]);
    return result;
  }
  async insertMetaData(id:number,country:string,state:string,city:string,pinCode:string,purposeOfSignIn:string,firstPaymentDate:Date,address:string,phone:string){
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
    console.log("Id",id);
    try{
      const sql="UPDATE users SET password=$2 WHERE id=$1 returning *";
      const result=await query(sql,[id,password]);
      return result;
    }
   catch(e){
    console.log("Error while inserting");
   }
  }
  async tokenUsed(id:number){
    const sql="UPDATE reset_password SET is_used=TRUE WHERE id=$1";
    const result=await query(sql,[id]);
    return result;
  }
}
