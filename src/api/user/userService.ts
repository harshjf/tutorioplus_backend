import { StatusCodes } from "http-status-codes";

import type { City, Country, State, Student, User, getStudentFilter, subject } from "@/api/user/userModel";
import { UserRepository } from "@/api/user/userRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import sendResetPasswordEmail from "@/common/utils/emailService";


export class UserService {
  private userRepository: UserRepository;

  constructor(repository: UserRepository = new UserRepository()) {
    this.userRepository = repository;
  }

  async findAll(): Promise<ServiceResponse<User[] | null>> {
    try {
      const users = await this.userRepository.findAllAsync();
      if (!users || users.length === 0) {
        return ServiceResponse.failure("No Users found", null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success<User[]>("Users found", users);
    } catch (ex) {
      const errorMessage = `Error finding all users: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving users.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async signIn(email:string, password:string): Promise<ServiceResponse<{ token: string } | null>>{
    try{
      const user=await this.userRepository.findByEmailAsync(email);
      if(!user){
        return ServiceResponse.failure("Invalid email!", null, StatusCodes.UNAUTHORIZED);
      }else{
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return ServiceResponse.failure("Invalid password!", null, StatusCodes.UNAUTHORIZED);
        }else{
          const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET as string, {
            expiresIn: "24h",
          });
          return ServiceResponse.success("Sign-in successful", { token });
        }
      }
    }catch(e){
      const errorMessage = `Error during sign-in: ${e}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("An error occurred during sign-in", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async signUp(name:string,email:string,password:string,countryId:number,stateId:number,cityId:number,pinCode:string,purposeOfSignIn:string,firstPaymentDate:Date,address:string,phone:string): Promise<ServiceResponse<User | null>>{
    const role_id=2;
    try{
      const hashedPassword = await bcrypt.hash(password, 10);
      const user=await this.userRepository.signUp(name,email,hashedPassword,role_id);
      const result=await this.userRepository.insertMetaData(user?.id || 0,countryId,stateId,cityId,pinCode,purposeOfSignIn,firstPaymentDate,address,phone);
      return ServiceResponse.success("User added successfully!", user);
    }catch(e){
      const errorMessage = `Error during sign-up: ${e}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("An error occurred during sign-up", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async addMentor(req:any): Promise<ServiceResponse<User | null>>{
    const{name,email,password}=req.body;
    const role_id=3;
    try{
      const hashedPassword = await bcrypt.hash(password, 10);
      const user=await this.userRepository.signUp(name,email,hashedPassword,role_id);

      // adding data to mentor_metadata
      const cvPath = req.files && req.files.cv ? req.files.cv[0].path : null;
      const photoPath = req.files && req.files.photo ? req.files.photo[0].path : null;
      const{phoneNumber,address,qualification,teachingExperience,jobType,country,state,city}=req.body;  
      const result=await this.userRepository.insertMentorMetaData(user?.id || 0,phoneNumber,address,qualification,teachingExperience,jobType,country,state,city,photoPath,cvPath);
      return ServiceResponse.success("Mentor added successfully!", result);

    }catch(e){
      const errorMessage = `Error during sign-up: ${e}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("An error occurred during sign-up", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
  async resetPassword(email:string){
    try{
      const user = await this.userRepository.findByEmailAsync(email);
      if(!user){
        return ServiceResponse.failure("This email address is not registered. Please check the email and try again.", null, StatusCodes.UNAUTHORIZED);
      }else{        
        const token=uuidv4();

        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1);

        await this.userRepository.saveResetToken(user.id, token, expiryDate);

        const resetLink = `http://localhost:3000/forgot-password?token=${token}`;
        await sendResetPasswordEmail(user.email,resetLink);
        return ServiceResponse.success("User found successfully!", user);
      }
      
    }catch(e){
      const errorMessage = `Error during reset-password: ${e}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("An error occurred while resetting the password", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async confirmResetPassword(token:string,password:string){
    try{
      const isTokenValid= await this.userRepository.isTokenValid(token);
      console.log("Is token valid",isTokenValid);
      if(!isTokenValid){
        return ServiceResponse.failure("Link is not valid, please try again!", null, StatusCodes.UNAUTHORIZED);
      }else{       
        const currentTime= new Date();
        if(currentTime>isTokenValid.expires_at){
          return ServiceResponse.failure("Link has been expired!", null, StatusCodes.UNAUTHORIZED);
        }else{
          if(isTokenValid.is_used){
            return ServiceResponse.failure("Token has already been used!", null, StatusCodes.UNAUTHORIZED);
          }else{
            console.log("Password",password);
            const hashedPassword = await bcrypt.hash(password, 10);
            console.log("hashed password",hashedPassword);
            const resetPassword=await this.userRepository.resetPassword(isTokenValid.student_id,hashedPassword);
            const markTokenUsed=await this.userRepository.tokenUsed(isTokenValid.id);
            return ServiceResponse.success("Your password has been reset successfully. You can now log in with your new password.",resetPassword);
          }
        } 
            
      }
    }catch(e){
      const errorMessage = `Error during reset-password: ${e}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("An error occurred while resetting the password", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async getSubjects(): Promise<ServiceResponse<subject[] | null>> {
    try {
     const subjects=await this.userRepository.getSubjects();
     return ServiceResponse.success<Country[]>("Subjects!", subjects);
    } catch (e) {
      const errorMessage = `Error during fetching subjects: ${e}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("An error occurred during fetching subjects", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async getStudents(filter:getStudentFilter): Promise<ServiceResponse<Student[] | null>>{
    try{
      const students = await this.userRepository.getStudents(filter);
      return ServiceResponse.success<Student[]>("Students!",students);
    }catch(e){
      const errorMessage = `Error during fetching students: ${e}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("An error occurred during fetching subjects", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllCountries(): Promise<ServiceResponse<Country[] | null>> {
    try {
     const countries=await this.userRepository.getAllCountries();
     return ServiceResponse.success<Country[]>("Countries!", countries);
    } catch (e) {
      const errorMessage = `Error during fetching countries: ${e}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("An error occurred during fetching countries", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async getStates(id:number): Promise<ServiceResponse<State[] | null>> {
    try {
     const states=await this.userRepository.getStates(id);
     return ServiceResponse.success<State[]>("States!", states);
    } catch (e) {
      const errorMessage = `Error during fetching states: ${e}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("An error occurred during fetching states", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async getCities(id:number): Promise<ServiceResponse<City[] | null>> {
    try {
     const cities=await this.userRepository.getCities(id);
     return ServiceResponse.success<City[]>("Cities!", cities);
    } catch (e) {
      const errorMessage = `Error during fetching cities: ${e}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("An error occurred during fetching cities", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

}

export const userService = new UserService();
