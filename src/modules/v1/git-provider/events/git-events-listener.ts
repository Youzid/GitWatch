// src/modules/notifications/listeners/user-events.listener.ts
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EVENTS } from '../../../../infra/events/events.constants';
import type { RepositoryCreatedPayload } from '../../../../infra/events/events.types';


@Injectable()
export class GitHubEventsListener {
  @OnEvent(EVENTS.REPOSITORY_CREATED)
   handleRepositoryCreated(payload: RepositoryCreatedPayload) {
    console.log(`triggering provider jobs ${payload.repositoryId}`);
  }

}