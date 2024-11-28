import { CommandHandler } from './command-handler.interface';

export class CommandBus {
  private readonly handlers = new Map<string, CommandHandler<any, any>>();

  register<TCommand, TResult>(
    commandName: string,
    handler: CommandHandler<TCommand, TResult>,
  ) {
    this.handlers.set(commandName, handler);
  }

  async execute<TCommand, TResult>(command: TCommand): Promise<TResult> {
    const handler = this.handlers.get(command.constructor.name);

    if (!handler) {
      throw new Error(
        `No handler registered for command ${command.constructor.name}`,
      );
    }

    return handler.execute(command);
  }
}
