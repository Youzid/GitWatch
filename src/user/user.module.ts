import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersService } from './user.service';

@Module({
    imports: [PrismaModule],
  controllers: [UserController],
  providers: [UsersService],
})
export class UserModule {}
