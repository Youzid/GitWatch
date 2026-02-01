import { Global, Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventsService } from './events.service';

@Global()
@Module({
  imports: [
    EventEmitterModule.forRoot({
        // those are default configs , can be customized
      wildcard: false,
      delimiter: '.',
      newListener: false,
      removeListener: false,
      maxListeners: 10,
      verboseMemoryLeak: false,
      ignoreErrors: false,
    }),
  ],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}