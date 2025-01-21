import type { City, Country, State, User } from "@/api/user/userModel";
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
  async signUp(name:string,email:string,password:string){
    const sql="INSERT INTO users (role_id, name, email, password) VALUES (2, $1, $2, $3) RETURNING *;"
    const result=await query(sql,[name,email,password]);
    return result[0];
  }
  async getSubjects(){
    const sql="SELECT * FROM subjects ";
    const result=await query(sql);
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
  async insertMetaData(id:number,countryId:number,stateId:number,cityId:number,pinCode:string,purposeOfSignIn:string,firstPaymentDate:Date,address:string,phone:string){
    const sql="INSERT INTO student_metadata(user_id,country_id,state_id,city_id,pincode,purpose_of_sign_in,first_payment_date,address,phone_number) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)";
    const result=await query(sql,[id,countryId,stateId,cityId,pinCode,purposeOfSignIn,firstPaymentDate,address,phone]);
    return result;
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
