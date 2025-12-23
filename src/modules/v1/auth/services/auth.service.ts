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

    async login(user: any) {
        const payload = { email: user.email, sub: user.id };
        const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7)

        await this.authRepository.saveRefreshToken({
            expires_at: expiresAt,
            refreshTokenHash: hashedRefreshToken,
            user_id: user.id
        });

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
        };
    }



    async register(registerAuthDto: RegisterAuthDto) {
        // check if email exists
        const user_exists = await this.usersFacade.findOneByEmail(registerAuthDto.email)
        if (user_exists) {
            throw new BadRequestException('Email already registered');// if user email exist , we should send reset password or email isntead of this message 
        }

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

    // async refreshTokens(userId: number, refreshToken: string) {
    //     const storedToken =
    //         await this.authRepository.findValidRefreshTokenByUser(userId);

    //     if (!storedToken) {
    //         throw new UnauthorizedException('Refresh token not found');
    //     }

    //     const tokenMatches = await bcrypt.compare(
    //         refreshToken,
    //         storedToken.refresh_token_hash,
    //     );

    //     if (!tokenMatches) {
    //         throw new UnauthorizedException('Invalid refresh token');
    //     }

    //     const payload = { sub: userId };

    //     const newAccessToken = this.jwtService.sign(payload);

    //     const newRefreshToken = this.jwtService.sign(payload)

    //     const newHashedRefresh = await bcrypt.hash(newRefreshToken, 10);

    //     await this.authRepository.updateRefreshToken(
    //         storedToken.id,
    //         newHashedRefresh,
    //         new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    //     );

    //     return {
    //         accessToken: newAccessToken,
    //         refreshToken: newRefreshToken,
    //     };
    // }
}


