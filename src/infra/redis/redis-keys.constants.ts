const PREFIX = 'dev';

export const CACHE_KEYS = {
  raw: {
    tree: (repositoryId: number ) =>
      `${PREFIX}:raw:tree:${repositoryId}`,

    commits: (repositoryId: number ) =>
      `${PREFIX}:raw:commits:${repositoryId}`,
  },

} as const;
