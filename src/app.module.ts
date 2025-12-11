import { Module } from '@nestjs/common';
import { ConfigModule} from '@nestjs/config';
import { AppController } from './app.controller';
import { UserModule } from './modules/v1/user/user.module';
import { LoggerModule } from './infra/logger/logger.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
        UserModule,
        LoggerModule,
    ],
    controllers: [AppController],
    providers: [],
})
export class AppModule { }
