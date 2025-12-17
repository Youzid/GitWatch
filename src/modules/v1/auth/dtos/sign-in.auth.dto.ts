import { IsEmail, IsNotEmpty } from "class-validator";

export class SignInAuthDto {
    @IsEmail()
    email: string;
    @IsNotEmpty()
    password: string;
}
