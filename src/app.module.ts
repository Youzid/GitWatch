import { Module } from '@nestjs/common';
import { ConfigModule} from '@nestjs/config';
import { AppController } from './app.controller';
import { AuthModule } from './modules/v1/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/v1/auth/guards/jwt-auth.guard';
import { RepositoryModule } from './modules/v1/repository/repository.module';
import { InfrastructureModule } from './infra/infrastructure.module';
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
        InfrastructureModule,
        AuthModule,
        RepositoryModule,
    ],
    controllers: [AppController],
    providers: [ {provide:APP_GUARD, useClass:JwtAuthGuard}],
})
export class AppModule { }
