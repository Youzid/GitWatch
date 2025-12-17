import { UserFacade } from './../../user/facades/user.facade';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInAuthDto } from '../dtos/sign-in.auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private userFacade: UserFacade
    ) { }

    async signIn({ email, password: pass }: SignInAuthDto) {
        const user = await this.userFacade.findOneByEmail(email)
        if (user?.password !== pass) {
            throw new UnauthorizedException("Invalid credentials")
        }
        const payload = { sub: user.id, email: user.email };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }

}
