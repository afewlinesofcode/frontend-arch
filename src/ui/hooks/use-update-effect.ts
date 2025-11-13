import { DependencyList, EffectCallback, useEffect, useRef } from 'react'

/**
 * A custom hook that runs an effect only on updates, not on the initial mount.
 * @param effect The effect callback to run on updates.
 * @param deps The dependency list that triggers the effect when changed.
 */
export default function useUpdateEffect(
  effect: EffectCallback,
  deps: DependencyList = []
) {
  const isInitialMount = useRef(true)

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    return effect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialMount, ...deps])
}
