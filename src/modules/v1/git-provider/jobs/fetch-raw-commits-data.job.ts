
export interface IFetchRawCommitsJob {
  repositoryId: number;
  owner: string;
  repo_name: string;
  token: string;
}

export const FETCH_RAW_COMMITS_JOB = 'fetch_raw_commits_job';

