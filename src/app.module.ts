import { Module } from '@nestjs/common';
import { ConfigModule} from '@nestjs/config';
import { AppController } from './app.controller';
import { UserModule } from './modules/v1/user/user.module';
import { LoggerModule } from './infra/logger/logger.module';
import { DatabaseModule } from './infra/database/database.module';
import { AuthModule } from './modules/v1/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/v1/auth/guards/jwt-auth.guard';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
        DatabaseModule,
        AuthModule,
        UserModule,
        LoggerModule,
    ],
    controllers: [AppController],
    providers: [DatabaseModule, {provide:APP_GUARD, useClass:JwtAuthGuard}],
})
export class AppModule { }
