import { IDomainEvent } from '../domain/domain-event.interface';

export interface CommandHandler<TCommand, TResult> {
  uncommittedEvents: IDomainEvent[];
  execute(command: TCommand): Promise<TResult>;
  getUncommittedEvents(): IDomainEvent[];
}
