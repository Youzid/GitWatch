import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { INormalizeProviderDataJob, NORMALIZE_PROVIDER_DATA_JOB_NAME } from '../jobs/normalize-provider-data.job';
import { QUEUE_NAMES } from '../../../../infra/queue/queue.names';

@Injectable()
export class RepositoryQueueService {
    constructor(
        @InjectQueue(QUEUE_NAMES.NORMALIZE_PROVIDER_DATA_QUEUE)
        private readonly normalizeQueue: Queue,
    ) { }

    async addNormalizeProviderDataJob(data: INormalizeProviderDataJob) {
        const job = await this.normalizeQueue.add(
            NORMALIZE_PROVIDER_DATA_JOB_NAME,
            data,
            {
                jobId: `normalize-${data.repositoryId}`,
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

        console.log( `[NormalizeProviderQueueService] Queued ${NORMALIZE_PROVIDER_DATA_JOB_NAME} job ${job.id} for repository ${data.repositoryId}`);
        return job;
    }

    // async hasNormalizationJobQueued(repositoryId: string): Promise<boolean> {
    //     const jobId = `normalize-${repositoryId}`;
    //     const job = await this.normalizeQueue.getJob(jobId);
        
    //     if (job) {
    //         const state = await job.getState();
    //         return ['waiting', 'active', 'delayed'].includes(state);
    //     }
        
    //     return false;
    // }

    // async getNormalizationJobStatus(repositoryId: string) {
    //     const jobId = `normalize-${repositoryId}`;
    //     const job = await this.normalizeQueue.getJob(jobId);
        
    //     if (!job) {
    //         return { exists: false, state: null };
    //     }
        
    //     const state = await job.getState();
    //     return {
    //         exists: true, state, jobId: job.id, data: job.data,progress: job.progress,
    //     };
    // }
}