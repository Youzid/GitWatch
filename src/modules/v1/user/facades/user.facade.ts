import { Injectable } from '@nestjs/common';
import { UserService } from '../services/user.service';

@Injectable()
export class UserFacade {
    constructor(private readonly authService: UserService) { }

    async findOneByEmail(email: string) {
        return await this.authService.findOneByEmail(email);
    }

}
