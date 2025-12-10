import { Expose } from 'class-transformer';
import {
    IsBoolean,
    IsEmail,
    IsEnum,
    IsInt,
    IsOptional,
    IsString,
} from 'class-validator';
import UserTypeOrmEntity, { UserRole } from '../../entities/user.entity';

export class UpdateUserRequest
    implements Partial<
        Pick<
            UserTypeOrmEntity,
            | 'id'
            | 'firstName'
            | 'lastName'
            | 'userName'
            | 'email'
            | 'phone'
            | 'avatar'
            | 'role'
            | 'isActivated'
        >
    >
{
    @Expose()
    @IsInt()
    id: number;

    @Expose()
    @IsOptional()
    @IsString()
    firstName?: string;

    @Expose()
    @IsOptional()
    @IsString()
    lastName?: string;

    @Expose()
    @IsOptional()
    @IsString()
    userName?: string;

    @Expose()
    @IsOptional()
    @IsEmail()
    email?: string;

    @Expose()
    @IsOptional()
    @IsString()
    phone?: string;

    @Expose()
    @IsOptional()
    @IsString()
    avatar?: string;

    @Expose()
    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;

    @Expose()
    @IsOptional()
    @IsBoolean()
    isActivated?: boolean;
}