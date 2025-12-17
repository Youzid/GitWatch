export class AuthCreatedEvent {
  constructor(public readonly id: string) {}
}

export class AuthUpdatedEvent {
  constructor(public readonly id: string) {}
}

export class AuthDeletedEvent {
  constructor(public readonly id: string) {}
}
