import { useRef } from 'react'

/**
 * A custom hook that determines if a value has toggled (changed) since the last render.
 * @param value The value to monitor for changes.
 * @returns A boolean indicating whether the value has toggled.
 */
export default function useToggled<T>(value: T): boolean {
  const previousValue = useRef<T>(value)
  const toggled = previousValue.current !== value

  if (toggled) {
    previousValue.current = value
  }

  return toggled
}
