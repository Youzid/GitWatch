export interface IFetchRawTreeDataJob {
  repositoryId: number;
  owner: string;
  repo_name: string;
  default_branch: string;
  token: string;
}

export const FETCH_RAW_TREE_DATA_JOB_NAME = 'fetch_raw_tree_data';

