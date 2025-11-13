import { describe, expect, it } from 'vitest'
import Reactive from '../../src/ui/contexts/demo/reactive'

describe('Reactive', function () {
  it('should initialize properly with scalar value', function () {
    const reactive = new Reactive(10)

    expect(reactive.value).toBe(10)
  })

  it('should initialize properly with object value', function () {
    const reactive = new Reactive({ a: 1, b: 2 })

    expect(reactive.value).toEqual({ a: 1, b: 2 })
  })

  it('should update value correctly', function () {
    const reactive = new Reactive(5)
    reactive.value = 20

    expect(reactive.value).toBe(20)
  })

  it('should notify subscribers on value change', function () {
    const reactive = new Reactive(0)
    let notifiedValue = 0

    reactive.subscribe((newValue) => {
      notifiedValue = newValue
    })

    reactive.value = 15

    expect(notifiedValue).toBe(15)
  })

  it('should not notify subscribers if value remains the same', function () {
    const reactive = new Reactive(100)
    let notificationCount = 0

    reactive.subscribe(() => {
      notificationCount++
    })

    reactive.value = 100 // same value, should not notify

    expect(notificationCount).toBe(0)
  })

  it('should handle multiple subscribers', function () {
    const reactive = new Reactive('initial')
    let firstNotifiedValue = ''
    let secondNotifiedValue = ''

    reactive.subscribe((newValue) => {
      firstNotifiedValue = newValue
    })

    reactive.subscribe((newValue) => {
      secondNotifiedValue = newValue
    })

    reactive.value = 'updated'

    expect(firstNotifiedValue).toBe('updated')
    expect(secondNotifiedValue).toBe('updated')
  })

  it('should allow unsubscribing from notifications', function () {
    const reactive = new Reactive(true)
    let notificationCount = 0

    const unsubscribe = reactive.subscribe(() => {
      notificationCount++
    })

    reactive.value = false
    unsubscribe()
    reactive.value = true

    expect(notificationCount).toBe(1)
  })
})
