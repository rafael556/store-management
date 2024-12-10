import { IDomainEvent } from '../domain/domain-event.interface';

export interface IDomainEventHandler {
  handle(event: IDomainEvent): Promise<void>;
}
