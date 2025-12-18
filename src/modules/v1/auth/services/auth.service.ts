import { UserFacade } from './../../user/facades/user.facade';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInAuthDto } from '../dtos/sign-in.auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private usersFacade: UserFacade,
        private jwtService: JwtService

    ) { }
    async validateUser({ email, password: pass }: SignInAuthDto) {
        const user = await this.usersFacade.findOneByEmail(email);
        if (!user || user.password !== pass) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const { password, ...result } = user;
        return result;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.userId };
        return {
            id: user.id,
            email: user.email,
            username: user.username,
            access_token: this.jwtService.sign(payload),
        };
    }
}
