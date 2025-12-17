import {
  Controller,
  Get,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { Public } from '../../auth/decorators/public.decorator';



@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  
  @Get()
  findAll() {
    return this.userService.getAll();
  }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.userService.getUserById(+id);
//   }

//   @Post()
//   create(@Body() dto: CreateUserDto) {
//     return this.userService.createUser(dto);
//   }

//   @Put(':id')
//   update(
//     @Param('id') id: string,
//     @Body() dto: UpdateUserDto,
//   ) {
//     return this.userService.updateUser(+id, dto);
//   }

//   @Delete(':id')
//   delete(@Param('id') id: string) {
//     return this.userService.deleteUser(+id);
//   }
}
