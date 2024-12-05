import { QueryHandler } from './query-handler.interface';

export class QueryBus {
  private readonly handlers = new Map<string, QueryHandler<any, any>>();

  register<TQuery, TResult>(
    queryName: string,
    handler: QueryHandler<TQuery, TResult>,
  ) {
    this.handlers.set(queryName, handler);
  }

  async execute<TQuery, TResult>(
    identifier: string,
    query: TQuery
  ): Promise<TResult> {
    const handler = this.handlers.get(identifier);

    if (!handler) {
      throw new Error(
        `No handler registered for query ${identifier}`,
      );
    }

    return handler.execute(query);
  }
}
