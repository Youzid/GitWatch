import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import databaseConfig, { databaseValidationSchema } from './config/database.config';
import { UserModule } from './user/user.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true, load: [databaseConfig],validationSchema: databaseValidationSchema, cache:true }),
        UserModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
