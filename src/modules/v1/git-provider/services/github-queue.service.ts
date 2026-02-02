import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { QUEUE_NAMES } from '../../../../infra/queue/queue.names';
import { FETCH_RAW_TREE_JOB, IFetchRawTreeJob } from '../jobs/fetch-raw-tree-data.job';
import { FETCH_RAW_COMMITS_JOB, IFetchRawCommitsJob } from '../jobs/fetch-raw-commits-data.job';

@Injectable()
export class GitHubQueueService {
    constructor(
        @InjectQueue(QUEUE_NAMES.FETCH_PROVIDER_DATA_QUEUE) private readonly fetchProviderDataQueue: Queue,
    ) { }

    async addFetchRawTreeDataJob(data: IFetchRawTreeJob) {
        const job = await this.fetchProviderDataQueue.add(
            FETCH_RAW_TREE_JOB,
            data,
            {
                jobId: `fetch-tree-${data.repositoryId}-${Date.now()}`,
                attempts: 3,
                priority: 10,
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

        console.log(`[GitHubQueueService] Queued ${FETCH_RAW_TREE_JOB} job ${job.id} for repository ${data.repositoryId}`);
        return job;
    }

    async addFetchRawCommitsDataJob(data: IFetchRawCommitsJob) {
        const job = await this.fetchProviderDataQueue.add(
            FETCH_RAW_COMMITS_JOB,
            data,
            {
                jobId: `fetch-commits-${data.repositoryId}-${Date.now()}`,
                attempts: 3,
                priority: 10,
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

        console.log(`[GitHubQueueService] Queued ${FETCH_RAW_COMMITS_JOB} job ${job.id} for repository ${data.repositoryId}`);
        return job;
    }

    async addFetchMainRawDataJobs({ repositoryId, owner, repo_name, default_branch, token, }: { repositoryId: number;owner: string; repo_name: string; default_branch: string;token: string;}) {

        const [treeJob, commitsJob] = await Promise.all([
            this.addFetchRawTreeDataJob({ repositoryId, owner, repo_name, default_branch, token, }),
            this.addFetchRawCommitsDataJob({ repositoryId, owner, repo_name, token, }),
        ]);

        console.log(`[GitHubQueueService] Queued both fetch jobs for repository ${repositoryId}`);
        return { treeJob, commitsJob };
    }
}

