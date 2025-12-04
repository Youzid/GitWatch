import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {

  async getAll() {
    return "this.prismaService.user.findMany()";
  }
}
