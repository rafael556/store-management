import { IDomainEvent } from '../../domain/domain-event.interface';
import { EventBus } from '../event.bus';

describe('EventBus', () => {
  let eventBus: EventBus;

  beforeEach(() => {
    eventBus = new EventBus();
  });

  it('should publish an event', async () => {
    const event: IDomainEvent = {
      aggregateId: '1',
      eventName: 'TestEvent',
      occurredOn: new Date(),
    };
    const listener = jest.fn();

    eventBus.register('TestEvent', listener);
    await eventBus.publish(event);

    expect(listener).toHaveBeenCalledWith(event);
  });

  it('should publish multiple events', async () => {
    const event1: IDomainEvent = {
      aggregateId: '1',
      eventName: 'TestEvent1',
      occurredOn: new Date(),
    };
    const event2: IDomainEvent = {
      aggregateId: '2',
      eventName: 'TestEvent2',
      occurredOn: new Date(),
    };
    const listener1 = jest.fn();
    const listener2 = jest.fn();

    eventBus.register('TestEvent1', listener1);
    eventBus.register('TestEvent2', listener2);

    await eventBus.publishAll([event1, event2]);

    expect(listener1).toHaveBeenCalledWith(event1);
    expect(listener2).toHaveBeenCalledWith(event2);
  });

  it('should register a listener', async () => {
    const event: IDomainEvent = {
      aggregateId: '1',
      eventName: 'TestEvent',
      occurredOn: new Date(),
    };
    const listener = jest.fn();

    eventBus.register('TestEvent', listener);
    await eventBus.publish(event);

    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('should unregister a listener', async () => {
    const event: IDomainEvent = {
      aggregateId: '1',
      eventName: 'TestEvent',
      occurredOn: new Date(),
    };
    const listener = jest.fn();

    eventBus.register('TestEvent', listener);
    eventBus.unregister('TestEvent', listener);
    await eventBus.publish(event);

    expect(listener).not.toHaveBeenCalled();
  });

  it('should handle multiple listeners for the same event', async () => {
    const event: IDomainEvent = {
      aggregateId: '1',
      eventName: 'TestEvent',
      occurredOn: new Date(),
    };
    const listener1 = jest.fn();
    const listener2 = jest.fn();

    eventBus.register('TestEvent', listener1);
    eventBus.register('TestEvent', listener2);
    await eventBus.publish(event);

    expect(listener1).toHaveBeenCalledWith(event);
    expect(listener2).toHaveBeenCalledWith(event);
  });
});
