import EventEmitter2 from 'eventemitter2';
import { IDomainEvent } from '../domain/domain-event.interface';

export class EventBus {
  private readonly emitter = new EventEmitter2();

  async publish(event: IDomainEvent) {
    this.emitter.emit(event.eventName, event);
  }

  async publishAll(events: IDomainEvent[]) {
    for (const event of events) {
      await this.publish(event);
    }
  }

  register(
    eventName: string,
    listener: (event: IDomainEvent) => Promise<void>,
  ) {
    this.emitter.on(eventName, listener);
  }

  unregister(
    eventName: string,
    listener: (event: IDomainEvent) => Promise<void>,
  ) {
    this.emitter.off(eventName, listener);
  }
}
