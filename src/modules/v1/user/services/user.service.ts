import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) { }

    getAll() {
        return this.userRepository.findAll();
    }
    async findOneByEmail(email: string): Promise<any> {
        const user = await this.userRepository.findOneByEmail(email);
        console.log(user)
        if (!user) {
            throw new UnauthorizedException('user not found');
        }
        return user;
    }

    //   getUserById(id: number) {
    //     return this.userDao.findById(id);
    //   }

    //   createUser(dto: CreateUserDto) {
    //     return this.userDao.create(dto);
    //   }

    //   updateUser(id: number, dto: UpdateUserDto) {
    //     return this.userDao.update(id, dto);
    //   }

    //   deleteUser(id: number) {
    //     return this.userDao.delete(id);
    //   }
}
