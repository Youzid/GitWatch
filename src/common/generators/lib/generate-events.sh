#!/bin/bash
# generators/lib/generate-events.sh

generate_events_file() {
  cat > $BASE_PATH/events/$MODULE_LOWER.event.ts << EOF
export class ${MODULE_PASCAL}CreatedEvent {
  constructor(public readonly id: string) {}
}

export class ${MODULE_PASCAL}UpdatedEvent {
  constructor(public readonly id: string) {}
}

export class ${MODULE_PASCAL}DeletedEvent {
  constructor(public readonly id: string) {}
}
EOF
}