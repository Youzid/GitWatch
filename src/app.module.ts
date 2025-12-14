import { Module } from '@nestjs/common';
import { ConfigModule} from '@nestjs/config';
import { AppController } from './app.controller';
import { UserModule } from './modules/v1/user/user.module';
import { LoggerModule } from './infra/logger/logger.module';
import { DatabaseModule } from './infra/database/database.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
        
        DatabaseModule,
        UserModule,
        LoggerModule,
    ],
    controllers: [AppController],
    providers: [DatabaseModule],
})
export class AppModule { }
