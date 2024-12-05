import { CommandHandler } from '../command-handler.interface';
import { CommandBus } from '../command.bus';

describe('CommandBus', () => {
  class TestCommand {
    constructor(public readonly payload: string) {}
  }

  class TestCommandHandler implements CommandHandler<TestCommand, string> {
    async execute(command: TestCommand): Promise<string> {
      return `Handled: ${command.payload}`;
    }
  }

  let commandBus: CommandBus;

  beforeEach(() => {
    commandBus = new CommandBus();
  });

  it('should register a handler for a command', () => {
    const handler = new TestCommandHandler();

    commandBus.register('TestCommand', handler);

    expect(commandBus['handlers'].get('TestCommand')).toBe(handler);
  });

  it('should execute the appropriate handler for a command', async () => {
    // Arrange
    const handler = new TestCommandHandler();
    const spy = jest.spyOn(handler, 'execute');
    commandBus.register('TestCommand', handler);

    const command = new TestCommand('Test Payload');

    // Act
    const result = await commandBus.execute('TestCommand', command);

    // Assert
    expect(result).toBe('Handled: Test Payload');
    expect(spy).toHaveBeenCalledWith(command);
  });

  it('should throw an error if no handler is registered for a command', async () => {
    const command = new TestCommand('Test Payload');

    await expect(commandBus.execute('TestCommand', command)).rejects.toThrow(
      `No handler registered for identifier TestCommand`,
    );
  });

  it('should overwrite the handler if registered twice with the same command name', () => {
    const handler1 = new TestCommandHandler();
    const handler2 = new TestCommandHandler();

    commandBus.register('TestCommand', handler1);
    commandBus.register('TestCommand', handler2);

    expect(commandBus['handlers'].get('TestCommand')).toBe(handler2);
  });
});
