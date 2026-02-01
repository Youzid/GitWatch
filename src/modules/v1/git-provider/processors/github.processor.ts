import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable } from '@nestjs/common'
import { QUEUE_NAMES } from '../../../../infra/queue/queue.names';
import {
    IFetchRawTreeDataJob,
    FETCH_RAW_TREE_DATA_JOB_NAME
} from '../jobs/fetch-raw-tree-data.job';
import {
    IFetchRawCommitsDataJob,
    FETCH_RAW_COMMITS_DATA_JOB_NAME
} from '../jobs/fetch-raw-commits-data.job';
import { GitHubService } from '../services/github-service';
import { RedisService } from '../../../../infra/redis/redis.service';

@Processor(QUEUE_NAMES.FETCH_PROVIDER_DATA_QUEUE, {
    concurrency: 5,
    limiter: { // provider limiter
        max: 10,
        duration: 60000,
    },
})
@Injectable()
export class GitHubProcessor extends WorkerHost {
    constructor(
        private readonly githubService: GitHubService,
        private readonly redisService: RedisService,
    ) {
        super();
    }

    async process(job: Job<IFetchRawTreeDataJob | IFetchRawCommitsDataJob>) {
        console.log(`[GitHubProcessor] Processing job ${job.id} of type ${job.name}`);

        switch (job.name) {
            case FETCH_RAW_TREE_DATA_JOB_NAME:
                return this.processFetchRawTreeData(job as Job<IFetchRawTreeDataJob>);

            case FETCH_RAW_COMMITS_DATA_JOB_NAME:
                return this.processFetchRawCommitsData(job as Job<IFetchRawCommitsDataJob>);

            default:
                throw new Error(`Unknown job name: ${job.name}`);
        }
    }

    private async processFetchRawTreeData(job: Job<IFetchRawTreeDataJob>) {
        const { repositoryId, owner, repo_name, default_branch, token } = job.data;

        try {
            console.log(`[GitHubProcessor] Fetching tree data for ${owner}/${repo_name} (repo ${repositoryId})`);
            
            const treeData = await this.githubService.getTreeData({ owner, repo_name, default_branch, token, });

            const cacheKey = `raw:tree:${repositoryId}`;
            await this.redisService.set(cacheKey, treeData);

            console.log(`[GitHubProcessor] Cached tree data in Redis with key: ${cacheKey}`);

            return { success: true, repositoryId, dataType: 'tree', cached: true, };
        } catch (error) {
            console.error(`[GitHubProcessor] Failed to fetch tree data for repository ${repositoryId}:`, error);
            throw error;
        }
    }
    private async processFetchRawCommitsData(job: Job<IFetchRawCommitsDataJob>) {
        const { repositoryId, owner, repo_name, token } = job.data;

        try {
            console.log(`[GitHubProcessor] Fetching commits data for ${owner}/${repo_name} (repo ${repositoryId})`);

            // const commitsData = await this.githubService.getCommitsData({ owner, repo_name, token });

            // Placeholder until method is implemented
            const commitsData = { placeholder: true, message: 'getCommitsData method not yet implemented in GitHubService', repositoryId, owner, repo_name };

            const cacheKey = `raw:commits:${repositoryId}`;
            await this.redisService.set(cacheKey, commitsData);

            console.log(`[GitHubProcessor] Cached commits data in Redis with key: ${cacheKey}`);

            return { success: true, repositoryId, dataType: 'commits', cached: true, };

        } catch (error) {
            console.error(`[GitHubProcessor] Failed to fetch commits data for repository ${repositoryId}:`, error);
            throw error;
        }
    }
    
    //  private async checkAndEnqueueNormalization(repositoryId: string, owner: string, repo_name: string) {
    //     const treeCacheKey = `raw:tree:${repositoryId}`;
    //     const commitsCacheKey = `raw:commits:${repositoryId}`;

    //     const [treeDataExists, commitsDataExists] = await Promise.all([
    //         this.redisService.exists(treeCacheKey),
    //         this.redisService.exists(commitsCacheKey),
    //     ]);

    //     if (treeDataExists && commitsDataExists) {
            
    //         await this.normalizeQueue.add(
    //             NORMALIZE_REPOSITORY_DATA,
    //             {
    //                 repositoryId,owner,repo_name,
    //             },
    //             {
    //                 jobId: `normalize-${repositoryId}`,
    //                 removeOnComplete: true,
    //                 removeOnFail: false,
    //             }
    //         );

    //         console.log(`[GitHubProcessor] Normalization job enqueued for repository ${repositoryId}`);
    //     } else {
    //         console.log(`[GitHubProcessor] Waiting for all data to be cached for repository ${repositoryId}. Tree: ${treeDataExists}, Commits: ${commitsDataExists}`);
    //     }
    // }
}
