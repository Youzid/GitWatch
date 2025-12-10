import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { UserFacade } from '../user/facades/user.facade';

@Module({
    imports: [UserFacade],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [
        UserFacade
    ]
})
export class AuthModule { }
