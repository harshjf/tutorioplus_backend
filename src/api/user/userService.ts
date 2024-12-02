import { StatusCodes } from "http-status-codes";

import type { City, Country, State, User } from "@/api/user/userModel";
import { UserRepository } from "@/api/user/userRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';


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

  async signUp(name:string,email:string,password:string,countryId:number,stateId:number,cityId:number,pinCode:string,purposeOfSignIn:string,firstPaymentDate:Date): Promise<ServiceResponse<User | null>>{
    try{
      const hashedPassword = await bcrypt.hash(password, 10);
      const user=await this.userRepository.signUp(name,email,hashedPassword);
      const result=await this.userRepository.insertMetaData(user?.id || 0,countryId,stateId,cityId,pinCode,purposeOfSignIn,firstPaymentDate);
      return ServiceResponse.success("User added successfully!", user);
    }catch(e){
      const errorMessage = `Error during sign-up: ${e}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("An error occurred during sign-up", null, StatusCodes.INTERNAL_SERVER_ERROR);
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
