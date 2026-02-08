import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable } from '@nestjs/common'
import { QUEUE_NAMES } from '../../../../infra/queue/queue.names';
import { FETCH_RAW_TREE_JOB, IFetchRawTreeJob } from '../jobs/fetch-raw-tree-data.job';
import { FETCH_RAW_COMMITS_JOB, IFetchRawCommitsJob } from '../jobs/fetch-raw-commits-data.job';
import { GitHubService } from '../services/github-service';
import { RedisService } from '../../../../infra/redis/redis.service';
import { EventsService } from '../../../../infra/events/events.service';
import { CACHE_KEYS } from '../../../../infra/redis/redis-keys.constants.js';
import { GitService } from '../services/git-service';

@Processor(QUEUE_NAMES.FETCH_PROVIDER_DATA_QUEUE, {
    concurrency: 5,
    limiter: {
        max: 10,
        duration: 60000,
    },
})
@Injectable()
export class GitHubProcessor extends WorkerHost {
    constructor(
        private readonly githubService: GitHubService,
        private readonly gitService: GitService,
        private readonly redisService: RedisService,
        private readonly eventService: EventsService
    ) {
        super();
    }

    async process(job: Job<IFetchRawTreeJob | IFetchRawCommitsJob>) {
        switch (job.name) {
            case FETCH_RAW_TREE_JOB:
                return this.processFetchRawTreeData(job as Job<IFetchRawTreeJob>);

            case FETCH_RAW_COMMITS_JOB:
                return this.processFetchRawCommitsData(job as Job<IFetchRawCommitsJob>);
            default:
                throw new Error(`Unknown job name: ${job.name}`);
        }
    }

    private async processFetchRawTreeData(job: Job<IFetchRawTreeJob>) {
        const { repositoryId, owner, repo_name, token } = job.data;

        const decryptedToken = token // this.encryptionService.decrypt(token);
        const authenticatedUrl = `https://${decryptedToken}@github.com/${owner}/${repo_name}.git`;
        const savedRepoGitFolderPath = await this.gitService.cloneRepository({ repositoryId, owner, repo_name, authenticatedUrl, token, });
        // save in db,
        // if save failed in db remove the folder from storage and return error

        const treeData = await this.gitService.getTreeData({ repositoryId });

        // const cacheKey = CACHE_KEYS.raw.tree(repositoryId);
        // await this.redisService.set(cacheKey, treeData);
        // this.eventService.emit(EVENTS.TREE_CACHED, { repositoryId , cacheKey});

        return { success: true, repositoryId, dataType: 'tree', cached: true, };
    }

    private async processFetchRawCommitsData(job: Job<IFetchRawCommitsJob>) {
        const { repositoryId, owner, repo_name, token } = job.data;

        // Placeholder until method is implemented
        const commitsData = { placeholder: true, message: 'getCommitsData method not yet implemented in GitHubService', repositoryId, owner, repo_name };
        const cacheKey = CACHE_KEYS.raw.commits(repositoryId);
        await this.redisService.set(cacheKey, commitsData);
        return { success: true, repositoryId, dataType: 'commits', cached: true, };

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
