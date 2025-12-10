import { Inject, Injectable } from "@nestjs/common";
import { UserRepository } from "../repositories/user.repository";
import { UpdateUserRequestModel } from "../dto/requests";
import { plainToInstance } from "class-transformer";
import UserTypeOrmEntity from "../entities/user.entity";
import { CreateUserUseDTO, UpdatedUserDTO } from "../dto";
import { UserResponse } from "../dto/responses/user.response";
import { CreateUserRequest } from "../dto/requests/create-user.request";

@Injectable()
export class UserService {
    constructor(
        @Inject()
        private readonly userRepo: UserRepository
    ){}

    async getUsers(): Promise<UserResponse[]> {
        const data: UserTypeOrmEntity[] = await this.userRepo.findAll()
        return plainToInstance(UserResponse, data)
    }

    async getUserById(id: number): Promise<UserResponse| null> {
        const data: UserTypeOrmEntity | null = await this.userRepo.findOne(id)

        if(!data)  return null

        return plainToInstance(UserResponse, data)
    }

    async createUser(requestModel: CreateUserRequest): Promise<UserResponse | null> {
        const userDto: CreateUserUseDTO = plainToInstance(CreateUserUseDTO, requestModel)
        const preparedData: UserTypeOrmEntity = plainToInstance(UserTypeOrmEntity, userDto)
        const result: Partial<UserTypeOrmEntity> & UserTypeOrmEntity = await this.userRepo.create(preparedData)

        if(!result) return null

        return plainToInstance(UserResponse, result)
    }

    async updateUser(requestModel: UpdateUserRequestModel): Promise<boolean> {
        const userDto: UpdatedUserDTO = plainToInstance(UpdatedUserDTO, requestModel)
        const preparedData: UserTypeOrmEntity = plainToInstance(UserTypeOrmEntity, userDto)
        const result: boolean = await this.userRepo.update(preparedData.id, preparedData)
        
        return result
    }

    async deleteUser(id: number): Promise<boolean> {
        const result:boolean = await this.userRepo.delete(id)
        
        return result
    }
}