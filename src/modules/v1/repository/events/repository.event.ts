export class RepositoryCreatedEvent {
  constructor(public readonly id: string) {}
}

export class RepositoryUpdatedEvent {
  constructor(public readonly id: string) {}
}

export class RepositoryDeletedEvent {
  constructor(public readonly id: string) {}
}
