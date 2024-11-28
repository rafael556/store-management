import { QueryHandler } from './query-handler.interface';

export class QueryBus {
  private readonly handlers = new Map<string, QueryHandler<any, any>>();

  register<TQuery, TResult>(
    queryName: string,
    handler: QueryHandler<TQuery, TResult>,
  ) {
    this.handlers.set(queryName, handler);
  }

  async execute<TQuery, TResult>(query: TQuery): Promise<TResult> {
    const handler = this.handlers.get(query.constructor.name);

    if (!handler) {
      throw new Error(
        `No handler registered for query ${query.constructor.name}`,
      );
    }

    return handler.execute(query);
  }
}
