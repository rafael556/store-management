import { CommandHandler } from './command-handler.interface';
import { EventBus } from './event.bus';

export class CommandBus {
  private readonly handlers = new Map<string, CommandHandler<any, any>>();

  constructor(private readonly eventBus: EventBus) {}

  register<TCommand, TResult>(
    commandName: string,
    handler: CommandHandler<TCommand, TResult>,
  ) {
    this.handlers.set(commandName, handler);
  }

  async execute<TCommand, TResult>(
    identifier: string,
    command: TCommand,
  ): Promise<TResult> {
    const handler = this.handlers.get(identifier);

    if (!handler) {
      throw new Error(`No handler registered for identifier ${identifier}`);
    }

    const result = await handler.execute(command);

    if (handler.getUncommittedEvents().length) {
      await this.eventBus.publishAll(handler.getUncommittedEvents());
    }

    return result;
  }
}
