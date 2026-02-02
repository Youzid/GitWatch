export const EVENTS = {
  REPOSITORY_CREATED: 'repository.created',
  TREE_CACHED: 'repository.tree.cached',
  COMMITES_CACHED: 'repository.commits.cached',
//   TREE_NORMALIZED: 'repository.tree.normalized',
//   COMMITES_NORMALIZED: 'repository.commits.normalized',
 
} as const;

export type EventName = typeof EVENTS[keyof typeof EVENTS];