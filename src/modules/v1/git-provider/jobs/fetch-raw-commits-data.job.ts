
export interface IFetchRawCommitsDataJob {
  repositoryId: number;
  owner: string;
  repo_name: string;
  token: string;
}

export const FETCH_RAW_COMMITS_DATA_JOB_NAME = 'fetch_raw_commits_data';

