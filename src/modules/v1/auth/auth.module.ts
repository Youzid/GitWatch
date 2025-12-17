import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { AuthFacade } from './facades/auth.facade';
import { AuthRepository } from './repositories/auth.repository';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './guards/constants';
import { UserModule } from '../user/user.module';
import { DatabaseModule } from '../../../infra/database/database.module';

@Module({
    imports: [
        DatabaseModule,
        UserModule,
        JwtModule.register({
            global: true,
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '259200s' },
        }),
    ],
    controllers: [AuthController],
    providers: [ AuthService, AuthFacade, AuthRepository],
    exports: [AuthFacade],
})
export class AuthModule { }
