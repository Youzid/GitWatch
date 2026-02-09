import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { RepositoryQueueService } from '../services/repository-queue-service';
import { EVENTS } from '../../../../infra/events/events.constants';
import type { TreeCachedPayload } from '../../../../infra/events/events.types';


@Injectable()
export class RepositoryEventsListener {
    constructor(
        private readonly repositoryQueueService: RepositoryQueueService
    ) { }
    @OnEvent(EVENTS.TREE_CACHED)
    async handleTreeCached(payload: TreeCachedPayload) {
        await this.repositoryQueueService.addNormalizeTreeJob(payload);
    }

}