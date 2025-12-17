import { Injectable } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { SignInAuthDto } from '../dtos/sign-in.auth.dto';

@Injectable()
export class AuthFacade {
    constructor(private readonly authService: AuthService) { }

    async signIn(signInAuthdto: SignInAuthDto) {
        return await this.authService.signIn(signInAuthdto);
    }

}
