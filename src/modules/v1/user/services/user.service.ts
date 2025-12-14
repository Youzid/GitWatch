import { Injectable } from '@nestjs/common';
import { UserDao } from '../daos/user.dao';

@Injectable()
export class UserService {
  constructor(private readonly userDao: UserDao) {}

  getAllUsers() {
    return this.userDao.findAll();
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
