import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EVENTS } from '../../../../infra/events/events.constants';
import type { RepositoryCreatedPayload } from '../../../../infra/events/events.types';
import { GitHubQueueService } from '../services/github-queue.service';


@Injectable()
export class GitHubEventsListener {
    constructor(
        private readonly githubQueueService: GitHubQueueService
    ) { }
    @OnEvent(EVENTS.REPOSITORY_CREATED)
    async handleRepositoryCreated(payload: RepositoryCreatedPayload) {
        await this.githubQueueService.addFetchMainRawDataJobs({
            repositoryId: payload.repositoryId,
            default_branch: payload.default_branch,
            owner: payload.owner,
            repo_name: payload.repo_name,
            token: payload.token,
        }
        );
        console.log(`triggering provider jobs ${payload.repositoryId}`);
    }

}