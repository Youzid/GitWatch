import { Global, Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventsService } from './events.service';

@Global()
@Module({
  imports: [
    EventEmitterModule.forRoot({
      // Use this instance throughout the app
      wildcard: false,
      // The delimiter used to segment namespaces
      delimiter: '.',
      // Set this to `true` to use wildcards
      newListener: false,
      // Set this to `true` to emit the newListener event
      removeListener: false,
      // The maximum amount of listeners that can be assigned to an event
      maxListeners: 10,
      // Show event name in memory leak message
      verboseMemoryLeak: false,
      // Disable throwing uncaughtException if an error event is emitted
      ignoreErrors: false,
    }),
  ],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}