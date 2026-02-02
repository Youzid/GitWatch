export interface IFetchRawTreeJob {
  repositoryId: number;
  owner: string;
  repo_name: string;
  default_branch: string;
  token: string;
}

export const FETCH_RAW_TREE_JOB= 'fetch_raw_tree_job';

