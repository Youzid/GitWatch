export const EVENTS = {
  REPOSITORY_CREATED: 'repository.created',
 
} as const;

export type EventName = typeof EVENTS[keyof typeof EVENTS];