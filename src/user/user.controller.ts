import { Controller, Get,Body, } from '@nestjs/common';

import { UsersService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UsersService) {}

//   @Post()
//   create(@Body() createUserDto: CreateUserDto) {
//     return this.userService.create(createUserDto);
//   }

  @Get()
  findAll() {
    return this.userService.getAll();
  }

}
