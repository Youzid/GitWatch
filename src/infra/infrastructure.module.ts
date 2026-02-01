import { Global, Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { RedisModule } from './redis/redis.module';
import { QueueModule } from './queue/queue.module';
import { LoggerModule } from './logger/logger.module';
import { EventsModule } from './events/events.module';
import { EncryptionService } from './utils/encryption.service';

@Global()
@Module({
    imports: [
        RedisModule,
        QueueModule,
        DatabaseModule,
        LoggerModule,
        EventsModule,
    ],
    providers: [EncryptionService],
    exports: [
        RedisModule,
        EventsModule,
        EncryptionService,
        QueueModule,
        DatabaseModule,
        LoggerModule,
    ],
})
export class InfrastructureModule { }
