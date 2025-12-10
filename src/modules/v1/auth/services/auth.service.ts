
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserFacade } from '../../user/facades/user.facade';

@Injectable()
export class AuthService {
  constructor(private userFacade: UserFacade) {}

  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.userFacade.getUserById(1);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const { password, ...result } = user;
    // TODO: Generate a JWT and return it here
    // instead of the user object
    return result;
  }
}
