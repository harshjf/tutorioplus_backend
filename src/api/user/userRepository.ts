import type { City, Country, State, User } from "@/api/user/userModel";
import {query} from "@/common/models/database"

export class UserRepository {
  async findAllAsync(): Promise<User[]> {
    const sql = "SELECT * FROM users";
    const result= await query(sql);
    return result;
  }

  async findByEmailAsync(email:string) : Promise<User|null>{
    const sql="SELECT * FROM users WHERE email=$1";
    const result=await query(sql,[email]);
    return result[0];
  }
  async signUp(name:string,email:string,password:string): Promise<User|null>{
    const sql="INSERT INTO users (role_id, name, email, password) VALUES (2, $1, $2, $3) RETURNING *;"
    const result=await query(sql,[name,email,password]);
    return result[0];
  }
  async getAllCountries():Promise<Country[]>{
    const sql="SELECT * FROM countries";
    const result=await query(sql);
    return result;
  }
  async getStates(id:number):Promise<State[]>{
    const sql="SELECT * FROM states where country_id=$1";
    const result=await query(sql,[id]);
    return result;
  }
  async getCities(id:number):Promise<City[]>{
    const sql="SELECT * FROM cities where state_id=$1";
    const result=await query(sql,[id]);
    return result;
  }
  async insertMetaData(id:number,countryId:number,stateId:number,cityId:number,pinCode:string,purposeOfSignIn:string,firstPaymentDate:Date){
    const sql="INSERT INTO student_metadata(user_id,country_id,state_id,city_id,pincode,purpose_of_sign_in,first_payment_date) VALUES($1,$2,$3,$4,$5,$6,$7)";
    const result=await query(sql,[id,countryId,stateId,cityId,pinCode,purposeOfSignIn,firstPaymentDate]);
    return result;
  }
}
