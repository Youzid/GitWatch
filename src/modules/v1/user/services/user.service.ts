import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserDto } from '../dtos/create-user.dto';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) { }

    getAll() {
        return this.userRepository.findAll();
    }
    async findOneByEmail(email: string): Promise<any> {
        const user = await this.userRepository.findOneByEmail(email);
        return user;
    }

    async create(createUserDto: CreateUserDto) {
        const user = await this.userRepository.create(createUserDto);
        return user;
    }
}
