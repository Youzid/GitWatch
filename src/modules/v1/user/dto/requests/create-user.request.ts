import { Expose } from "class-transformer"
import UserTypeOrmEntity from "../../entities/user.entity"
import { IsString, IsEmail, IsOptional, MinLength, IsEnum } from 'class-validator';

export class CreateUserRequest implements Pick<UserTypeOrmEntity,'id' | 'firstName' | 'lastName' | 'userName' | 'email' | 'phone' | 'avatar' | 'role' | 'isActivated' | 'createdAt' | 'updatedAt'> {
@isString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsString()
    userName: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    avatar?: string;

    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole = UserRole.GUEST;
}