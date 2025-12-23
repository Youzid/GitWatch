import { IsEmail, IsOptional, IsString, MinLength ,} from "class-validator";

export class RegisterAuthDto {
    @IsEmail()
    email: string;
    
    @IsString()
    username:string;
    
    @IsOptional()
    first_name:string;
    
    @IsOptional()
    last_name:string;
    
    @IsString()
    @MinLength(8)
    password: string;
}
