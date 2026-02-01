import { Module } from '@nestjs/common';
import { GitHubService } from './services/github-service';
import { GithubHttp } from './config/github-http';
import { HttpModule } from '@nestjs/axios';
import { QueueModule } from '../../../infra/queue/queue.module';
import { RedisModule } from '../../../infra/redis/redis.module';
import { GitHubProcessor } from './processors/github.processor';
import { GitHubQueueService } from './services/github-queue.service';
import {GitHubEventsListener } from './events/git-events-listener';

@Module({
    imports: [
        HttpModule,
        QueueModule,
        RedisModule,
    ],
    providers: [
        GitHubService,
        GithubHttp,
        GitHubEventsListener,
        GitHubProcessor,
        GitHubQueueService, 
    ],
    exports: [
        GitHubService,
        GitHubQueueService,
    ],
})
export class GithubModule { }
