// src/modules/repository/infrastructure/queue/processors/normalize-repository-data.processor.ts

import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable } from '@nestjs/common';
import { RedisService } from '../../../../infra/redis/redis.service';
import { QUEUE_NAMES } from '../../../../infra/queue/queue.names';
import { INormalizeProviderDataJob, NORMALIZE_PROVIDER_DATA_JOB_NAME } from '../jobs/normalize-provider-data.job';


@Processor(QUEUE_NAMES.NORMALIZE_PROVIDER_DATA_QUEUE, {concurrency: 10,})
@Injectable()
export class NormalizeRepositoryDataProcessor extends WorkerHost {
    constructor(
        private readonly redisService: RedisService,
    ) {
        super();
    }

    async process(job: Job<INormalizeProviderDataJob>) {
        console.log(`[NormalizeRepositoryDataProcessor] Processing job ${job.id} of type ${job.name}`);

        switch (job.name) {
            case NORMALIZE_PROVIDER_DATA_JOB_NAME:
                return this.processRepositoryData(job);

            default:
                throw new Error(`Unknown job name: ${job.name}`);
        }
    }

    private async processRepositoryData(job: Job<INormalizeProviderDataJob>) {
        const { repositoryId, owner, repo_name } = job.data;

        try {
            console.log(`[NormalizeRepositoryDataProcessor] Starting normalization for ${owner}/${repo_name} (repo ${repositoryId})`);

            // Check if both raw data are cached
            const treeCacheKey = `raw:tree:${repositoryId}`;
            const commitsCacheKey = `raw:commits:${repositoryId}`;

            const [rawTreeData, rawCommitsData] = await Promise.all([ this.redisService.get(treeCacheKey), this.redisService.get(commitsCacheKey)]);
            

            if (!rawTreeData || !rawCommitsData) {
                const missing = [];
                if (!rawTreeData) missing.push('tree');
                if (!rawCommitsData) missing.push('commits');
                throw new Error( `Cannot normalize: missing cached data for repository ${repositoryId}. Missing: ${missing.join(', ')}`);
            }

                this.normalizeTreeData(rawTreeData);
                this.normalizeCommitsData(rawCommitsData);
            
            console.log(`[NormalizeRepositoryDataProcessor] Normalization complete for repository ${repositoryId}`);

        } catch (error) {
            console.error(
                `[NormalizeRepositoryDataProcessor] Failed to normalize data for repository ${repositoryId}:`,
                error
            );
            throw error;
        }
    }

    private normalizeTreeData(rawTreeData: any) {
        console.log(`[NormalizeRepositoryDataProcessor] Normalizing tree data`);
    }

    private normalizeCommitsData(rawCommitsData: any) {
        console.log(`[NormalizeRepositoryDataProcessor] Normalizing commits data`);
    }
}