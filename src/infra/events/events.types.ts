import { EVENTS } from "./events.constants";

export interface RepositoryCreatedPayload {
    repositoryId: number;
}

export interface EventPayloadMap {
    [EVENTS.REPOSITORY_CREATED]: RepositoryCreatedPayload;
}