import { useEffect, useState } from 'react'
import EventBus, { EventConstructor } from '../../ports/event-bus'

/**
 * A utility function to create a custom React hook that subscribes to specified events
 * from an EventBus and updates the state using a selector function.
 * @template Args The types of the arguments passed to the hook.
 * @template T The type of the state managed by the hook.
 * @template Events An array of event constructors that the hook will subscribe to.
 * @param selector A function that returns the current state.
 * @param eventBus The EventBus instance to subscribe to events from.
 * @param events An array of event constructors to listen for.
 * @returns A custom React hook that provides the selected state and updates on specified events.
 */
export function makeEventHook<
  Args extends unknown[],
  T,
  Events extends EventConstructor<object>[],
>(
  selector: (eventArg: InstanceType<Events[number]> | null, ...args: Args) => T,
  eventBus: EventBus,
  events: Events
) {
  return function (...args: Args) {
    const [state, setState] = useState(selector(null, ...args))

    useEffect(() => {
      const unsubscribe = events.map((event) =>
        eventBus.subscribe(event, (eventArg) => {
          setState(selector(eventArg, ...args))
        })
      )

      return () => {
        unsubscribe.forEach((fn) => fn())
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setState, ...args])

    return state
  }
}

/**
 * A variant of makeEventHook for array types.
 */
export function makeEventHookForArray<
  Args extends unknown[],
  T extends Array<unknown>,
  Events extends EventConstructor<object>[],
>(
  selector: (eventArg: InstanceType<Events[number]> | null, ...args: Args) => T,
  eventBus: EventBus,
  events: Events
) {
  return makeEventHook(
    (eventArg, ...args: Args) => [...selector(eventArg, ...args)],
    eventBus,
    events
  )
}

/**
 * A variant of makeEventHook for object types.
 */
export function makeEventHookForObject<
  Args extends unknown[],
  T extends object | null,
  Events extends EventConstructor<object>[],
>(
  selector: (eventArg: InstanceType<Events[number]> | null, ...args: Args) => T,
  eventBus: EventBus,
  events: Events
) {
  return makeEventHook(
    (eventArg, ...args: Args) => {
      const value = selector(eventArg, ...args)
      return value ? { ...value } : value
    },
    eventBus,
    events
  )
}
