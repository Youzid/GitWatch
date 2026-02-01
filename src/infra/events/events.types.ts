import { EVENTS } from "./events.constants";

export interface RepositoryCreatedPayload {
    repositoryId: number,
    owner: string,
    repo_name: string,
    default_branch: string,
    token: string,
}

export interface EventPayloadMap {
    [EVENTS.REPOSITORY_CREATED]: RepositoryCreatedPayload;
}