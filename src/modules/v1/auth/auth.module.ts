import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { AuthFacade } from './facades/auth.facade';
import { AuthRepository } from './repositories/auth.repository';
import { UserModule } from '../user/user.module';
import { DatabaseModule } from '../../../infra/database/database.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './strategies/constants';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
    imports: [
        DatabaseModule,
        UserModule,
        PassportModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '60s' },
        }),
    ],
    controllers: [AuthController],
    providers: [ AuthService, AuthFacade, AuthRepository,LocalStrategy,JwtStrategy],
    exports: [AuthFacade],
})
export class AuthModule { }
