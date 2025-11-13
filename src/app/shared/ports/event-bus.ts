/**
 * Represents a generic event with a type identifier.
 */
export type Event = object

/**
 * Represents a constructor type for events.
 */
export type EventConstructor<T extends Event = Event> = (new (
  ...args: never[]
) => T) & { id: string }

/**
 * Represents an event bus interface for publishing and subscribing to events.
 */
export default interface EventBus {
  /**
   * Publishes an event to the event bus.
   * @param event The event to publish.
   */
  publish(event: Event): void

  /**
   * Subscribes to an event on the event bus.
   * @param eventClass The class of the event to subscribe to.
   * @param listener The listener function to invoke when the event is published.
   * @returns A function to unsubscribe from the event.
   */
  subscribe<T extends Event>(
    eventClass: EventConstructor<T>,
    listener: (event: InstanceType<EventConstructor<T>>) => void
  ): () => void
}
