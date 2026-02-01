import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule } from '@nestjs/config';
import { QUEUE_NAMES } from './queue.names';

/**
 * Queue Module - Infrastructure Layer
 * 
 * Responsibilities:
 * - Configure BullMQ connection
 * - Register all queues (queues are registered here, processors in modules)
 * - Export BullModule for modules to use
 * 
 * Note: Processors live in their respective domain modules
 */
@Module({
    imports: [
        ConfigModule,
        BullModule.forRootAsync({
            useFactory: () => ({
                connection: {
                    host: process.env.REDIS_HOST || 'redis',
                    port: parseInt(process.env.REDIS_PORT || '6379'),
                },
                defaultJobOptions: { attempts: 3 },
            }),
        }),
        // Register all queues here
        // Processors are registered in their respective modules
        BullModule.registerQueue(
            { name: QUEUE_NAMES.FETCH_PROVIDER_DATA_QUEUE },
            { name: QUEUE_NAMES.NORMALIZE_PROVIDER_DATA_QUEUE },
        ),
    ],
    exports: [BullModule],
})
export class QueueModule { }
