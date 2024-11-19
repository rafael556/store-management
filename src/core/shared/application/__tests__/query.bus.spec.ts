import { QueryHandler } from "../query-handler.interface";
import { QueryBus } from "../query.bus";

describe('QueryBus', () => {
  class TestQuery {
    constructor(public readonly id: number) {}
  }

  class TestQueryHandler implements QueryHandler<TestQuery, string> {
    async execute(query: TestQuery): Promise<string> {
      return `Result for ID: ${query.id}`;
    }
  }

  let queryBus: QueryBus;

  beforeEach(() => {
    queryBus = new QueryBus();
  });

  it('should register a handler for a query', () => {
    const handler = new TestQueryHandler();

    queryBus.register('TestQuery', handler);

    expect(queryBus['handlers'].get('TestQuery')).toBe(handler);
  });

  it('should execute the appropriate handler for a query', async () => {
    // Arrange
    const handler = new TestQueryHandler();
    const spy = jest.spyOn(handler, 'execute');
    queryBus.register('TestQuery', handler);

    const query = new TestQuery(42);

    // Act
    const result = await queryBus.execute(query);

    // Assert
    expect(result).toBe('Result for ID: 42');
    expect(spy).toHaveBeenCalledWith(query);
  });

  it('should throw an error if no handler is registered for a query', async () => {
    const query = new TestQuery(42);

    await expect(queryBus.execute(query)).rejects.toThrow(
      `No handler registered for query TestQuery`,
    );
  });

  it('should overwrite the handler if registered twice with the same query name', () => {
    const handler1 = new TestQueryHandler();
    const handler2 = new TestQueryHandler();

    queryBus.register('TestQuery', handler1);
    queryBus.register('TestQuery', handler2);

    expect(queryBus['handlers'].get('TestQuery')).toBe(handler2);
  });
});
