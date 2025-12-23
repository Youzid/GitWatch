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
import { MailModule } from '../mail/mail.module';
import { jwtConfig } from './strategies/constants';
import { JwtAccessStrategy } from './strategies/jwt-acess.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';

@Module({
    imports: [
        DatabaseModule,
        UserModule,
        PassportModule,
        MailModule,
        JwtModule.register({
            secret: jwtConfig.access.secret,
            signOptions: { expiresIn: jwtConfig.access.expiresIn as any  },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, AuthFacade, AuthRepository, LocalStrategy, JwtAccessStrategy, JwtRefreshStrategy],
    exports: [AuthFacade],
})
export class AuthModule { }