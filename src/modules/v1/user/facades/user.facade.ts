import { Injectable } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dtos/create-user.dto';

@Injectable()
export class UserFacade {
    constructor(private readonly authService: UserService) { }

    async findOneByEmail(email: string) {
        return await this.authService.findOneByEmail(email);
    }
    async create(createUserDto: CreateUserDto) {
        return await this.authService.create(createUserDto);
    }

}
