import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { QUEUE_NAMES } from '../../../../infra/queue/queue.names';
import { NORMALIZE_TREE_JOB } from '../jobs/normalize-provider-data.job';
import { TreeCachedPayload } from '../../../../infra/events/events.types';

@Injectable()
export class RepositoryQueueService {
    constructor(
        @InjectQueue(QUEUE_NAMES.NORMALIZE_PROVIDER_DATA_QUEUE)
        private readonly normalizeQueue: Queue,
    ) { }

    async addNormalizeTreeJob(data: TreeCachedPayload) {
        const job = await this.normalizeQueue.add(NORMALIZE_TREE_JOB, data, {
            jobId: `normalize-tree-${data.repositoryId}`,
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 2000,
            },
            removeOnComplete: {
                age: 3600,
                count: 100,
            },
            removeOnFail: {
                age: 86400,
            },
        },
        );

        return job;
    }
}