import { EventEmitter } from 'events'
import EventBus, { EventConstructor, Event } from '../ports/event-bus'
import EventsError from '../errors/events-error'

/**
 * A standard implementation of the EventBus interface using Node.js EventEmitter.
 */
export default class EventEmitterEventBus implements EventBus {
  /** The internal event emitter instance. */
  private eventEmitter: EventEmitter

  /**
   * Creates an instance of StandardEventBus.
   */
  public constructor() {
    this.eventEmitter = new EventEmitter()
  }

  /**
   * Publishes an event to the event bus.
   * @param event The event to publish.
   */
  public publish<T extends Event>(event: T): void {
    const eventClass = event.constructor as EventConstructor<T>

    if (!eventClass['id']) {
      throw new EventsError('Event class must have a static `id` property.')
    }

    this.eventEmitter.emit(eventClass['id'], event)
  }

  /**
   * Subscribes to an event on the event bus.
   * @param eventName The name of the event to subscribe to.
   * @param listener The listener function to invoke when the event is published.
   * @returns A function to unsubscribe from the event.
   */
  public subscribe<T extends Event>(
    eventClass: EventConstructor<T>,
    listener: (event: T) => void
  ): () => void {
    this.eventEmitter.on(eventClass['id'], listener)

    return () => {
      this.eventEmitter.off(eventClass['id'], listener)
    }
  }
}
