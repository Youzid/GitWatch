export interface INormalizeTreeJob {
    repositoryId: number;
    cacheKey: string,
}
export interface INormalizeCommitsJob {
    repositoryId: number;
    cacheKey: string,

}

export const NORMALIZE_TREE_JOB = 'normalize-tree-job';
export const NORMALIZE_COMMITS_JOB = 'normalize-commits-job';