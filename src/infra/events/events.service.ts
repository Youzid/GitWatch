import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventName } from './events.constants';
import { EventPayloadMap } from './events.types';

@Injectable()
export class EventsService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  emit<K extends EventName>( event: K,payload: EventPayloadMap[K]): boolean {
    return this.eventEmitter.emit(event, payload);
  }

}