import { useEffect, useState } from 'react'

/**
 * A simple reactive state management class.
 * It allows subscribing to value changes and notifies subscribers when the value updates.
 */
export default class Reactive<T> {
  /** The current value of the reactive state. */
  private _value: T

  /** A set of subscriber callbacks that are called when the value changes. */
  private _subscribers: Set<(value: T) => void> = new Set()

  /**
   * Creates a new Reactive instance with the given initial value.
   * @param initialValue The initial value of the reactive state.
   */
  public constructor(initialValue: T) {
    this._value = initialValue
  }

  /**
   * Gets the current value.
   */
  public get value(): T {
    return this._value
  }

  /**
   * Sets a new value and notifies all subscribers if the value has changed.
   * @param newValue The new value to set.
   */
  public set value(newValue: T) {
    if (this._value !== newValue) {
      this._value = newValue
      this._subscribers.forEach((callback) => callback(newValue))
    }
  }

  /**
   * Adds a subscriber callback that will be called whenever the value changes.
   * @param callback The function to call on value changes.
   * @returns A function to unsubscribe the callback.
   */
  public subscribe(callback: (value: T) => void): () => void {
    this._subscribers.add(callback)

    return () => {
      this._subscribers.delete(callback)
    }
  }
}

/**
 * Custom hook to use a reactive value in a React component.
 * @param reactive The Reactive value to subscribe to.
 * @returns The current value of the Reactive.
 */
export function useReactiveValue<T>(reactive: Reactive<T>) {
  const [value, setValue] = useState(reactive.value)

  useEffect(() => {
    return reactive.subscribe((newValue) => setValue(newValue))
  }, [reactive])

  return value
}
