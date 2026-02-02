import { EVENTS } from "./events.constants";

export interface RepositoryCreatedPayload {
    repositoryId: number,
    owner: string,
    repo_name: string,
    default_branch: string,
    token: string,
}
export interface TreeCachedPayload {
    repositoryId: number,
    cacheKey: string,
}
export interface CommitsCachedPayload {
    repositoryId: number,
    cacheKey: string,
}

export interface EventPayloadMap {
    [EVENTS.REPOSITORY_CREATED]: RepositoryCreatedPayload;
    [EVENTS.TREE_CACHED]: TreeCachedPayload;
    [EVENTS.COMMITES_CACHED]: CommitsCachedPayload;
}