import { IDomainEvent } from '../../domain/domain-event.interface';
import { CommandHandler } from '../command-handler.interface';
import { CommandBus } from '../command.bus';
import { EventBus } from '../event.bus';

describe('CommandBus', () => {
  class TestCommand {
    constructor(public readonly payload: string) {}
  }

  class TestCommandHandler implements CommandHandler<TestCommand, string> {
    uncommittedEvents: IDomainEvent[] = [];
    getUncommittedEvents(): IDomainEvent[] {
      return this.uncommittedEvents;
    }

    async execute(command: TestCommand): Promise<string> {
      return `Handled: ${command.payload}`;
    }
  }

  class EventCommandHandler implements CommandHandler<TestCommand, string> {
    uncommittedEvents: any[] = [];

    async execute(command: TestCommand): Promise<string> {
      this.uncommittedEvents.push({
        event: 'TestEvent',
        data: command.payload,
      });
      return `Handled with Event: ${command.payload}`;
    }

    getUncommittedEvents() {
      return this.uncommittedEvents;
    }
  }

  let commandBus: CommandBus;
  let mockEventBus: jest.Mocked<EventBus>;

  beforeEach(() => {
    mockEventBus = {
      publishAll: jest.fn(),
    } as any;
    commandBus = new CommandBus(mockEventBus);
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

  it('should publish events after executing a handler with uncommitted events', async () => {
    const handler = new EventCommandHandler();
    const spy = jest.spyOn(handler, 'getUncommittedEvents');
    commandBus.register('TestCommand', handler);

    const command = new TestCommand('Event Payload');
    const result = await commandBus.execute('TestCommand', command);

    expect(result).toBe('Handled with Event: Event Payload');
    expect(spy).toHaveBeenCalled();
    expect(mockEventBus.publishAll).toHaveBeenCalledWith(
      handler.getUncommittedEvents(),
    );
  });

  it('should not call publishAll if handler has no uncommitted events', async () => {
    const handler = new TestCommandHandler();
    commandBus.register('TestCommand', handler);

    const command = new TestCommand('No Events');
    const result = await commandBus.execute('TestCommand', command);

    expect(result).toBe('Handled: No Events');
    expect(mockEventBus.publishAll).not.toHaveBeenCalled();
  });
});
