import { UserFacade } from './../../user/facades/user.facade';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInAuthDto } from '../dtos/sign-in.auth.dto';
import { JwtService } from '@nestjs/jwt';
import { RegisterAuthDto } from '../dtos/register-auth.dto';
import { MailService } from '../../mail/mail.service';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { AuthRepository } from '../repositories/auth.repository';

@Injectable()
export class AuthService {
    constructor(
        private usersFacade: UserFacade,
        private authRepository: AuthRepository,
        private jwtService: JwtService,
        private mailService: MailService
    ) { }

    async validateUser({ email, password: pass }: SignInAuthDto) {
        const user = await this.usersFacade.findOneByEmail(email);

        if (!user || !(await bcrypt.compare(pass, user.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const { password, ...result } = user;
        return result;
    }

    login(user: any) {
        const payload = { email: user.email, sub: user.userId };
        return {
            id: user.id,
            email: user.email,
            username: user.username,
            access_token: this.jwtService.sign(payload, { expiresIn: '15m' }),
        };
    }





    

    async register(registerAuthDto: RegisterAuthDto) {
        // check if email exists
        const user_exists = await this.usersFacade.findOneByEmail(registerAuthDto.email)
        if (user_exists) {
            throw new BadRequestException('Email already registered');// if user email exist , we should send reset password or email isntead of this message 
        }

        //  hashing pswrd 
        const hashedPassword = await bcrypt.hash(registerAuthDto.password, 10)

        const user = await this.usersFacade.create({
            email: registerAuthDto.email,
            password: hashedPassword,
            isActive: false,
            first_name: registerAuthDto.first_name,
            last_name: registerAuthDto.last_name,
            username: registerAuthDto?.username,
        })

        if (!user) { throw new BadRequestException("faield to create a user") }
        // generate verification token
        const verificationToken = randomUUID();
        const hashedToken = await bcrypt.hash(verificationToken, 10);
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);

        await this.authRepository.createEmailVerificationToken({
            expires_at: expiresAt,
            token_hash: hashedToken,
            user_id: user.id
        })



        await this.sendVerificationEmail(user.email, verificationToken);

        return user
    }

    async sendVerificationEmail(userEmail: string, token: string) {
        const verificationUrl = `http://localhost:3005/v1/auth/verify-email?token=${token}`;
        await this.mailService.sendEmail({
            to: userEmail,
            subject: 'Verify your email',
            context: {
                verificationUrl,
            },
        });
    }

    async verifyEmail(token: string) {
    const tokens = await this.authRepository.findValid();

        if (!tokens || tokens.length === 0) {
            throw new BadRequestException('Invalid or expired token');
        }
        const match = await Promise.all(
            tokens.map(async t => ({
                token: t,
                match: await bcrypt.compare(token, t.token_hash)
            }))
        );

        const validToken = match.find(m => m.match);
        if (!validToken) throw new BadRequestException('Invalid token');

        const user = await this.authRepository.verifyEmailTransaction(validToken.token.user_id, validToken.token.id);
        return {
            message: 'Email verified successfully',
            email: user.email,
        };
    }
}


