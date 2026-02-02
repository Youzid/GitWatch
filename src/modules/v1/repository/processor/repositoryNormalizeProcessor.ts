import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable } from '@nestjs/common'
import { QUEUE_NAMES } from '../../../../infra/queue/queue.names';
import { RedisService } from '../../../../infra/redis/redis.service';
import { EventsService } from '../../../../infra/events/events.service';
import { CACHE_KEYS } from '../../../../infra/redis/redis-keys.constants.js';
import { EVENTS } from '../../../../infra/events/events.constants.js';
import { RepositoryService } from '../services/repository.service';
import { INormalizeCommitsJob, INormalizeTreeJob, NORMALIZE_TREE_JOB } from '../jobs/normalize-provider-data.job';

@Processor(QUEUE_NAMES.FETCH_PROVIDER_DATA_QUEUE, {
    concurrency: 5,
    limiter: {
        max: 10,
        duration: 60000,
    },
})
@Injectable()
export class RepositoryNormalizeProcessor extends WorkerHost {
    constructor(
        private readonly repositoryService: RepositoryService,
        private readonly redisService: RedisService,
        private readonly eventService: EventsService
    ) {
        super();
    }

    async process(job: Job<INormalizeTreeJob | INormalizeCommitsJob >) {
        switch (job.name) {
            case NORMALIZE_TREE_JOB:
                return this.processNormalizeTreeData(job as Job<INormalizeTreeJob>);

            // case FETCH_RAW_COMMITS_JOB:
            //     return this.processFetchRawCommitsData(job as Job<IFetchRawCommitsJob>);
            default:
                throw new Error(`Unknown job name: ${job.name}`);
        }
    }

    private async processNormalizeTreeData(job: Job<INormalizeTreeJob>) {
        const { repositoryId } = job.data;
        //get cached tree data of this repo

        await  Promise.resolve(); // Simulate async work
        // await this.repositoryService.normaliezeTree({ owner, repo_name, default_branch, token, });
        // const cacheKey = CACHE_KEYS.raw.tree(repositoryId);
        // await this.redisService.set(cacheKey, treeData);
        // this.eventService.emit(EVENTS.TREE_FETCHED, { repositoryId });

        return { success: true, repositoryId, dataType: 'tree', cached: true, };
    }


    @OnWorkerEvent('completed')
    onCompleted(job: Job, result: any) {
        console.log(`Job completed`, JSON.stringify({ jobId: job.id, name: job.name, result, }));
    }

    @OnWorkerEvent('failed')
    onFailed(job: Job, error: Error) {
        console.error(`Job failed`, error.stack, JSON.stringify({ jobId: job?.id, name: job?.name, }));
    }

    @OnWorkerEvent('progress')
    onProgress(job: Job, progress: number | object) {
        console.debug(`Job progress`, JSON.stringify({ jobId: job.id, progress }));
    }

}
