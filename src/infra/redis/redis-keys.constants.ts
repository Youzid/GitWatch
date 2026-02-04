const PREFIX = 'dev';

export const CACHE_KEYS = {
    //  prefix should e aded based on environment
  raw: {
    tree: (repositoryId: number ) =>
      `raw:tree:${repositoryId}`,

    commits: (repositoryId: number ) =>
      `raw:commits:${repositoryId}`,
  },

} as const;
