import { vi } from 'vitest'

export type EventBusMock = ReturnType<typeof mockEventBus>

export default function mockEventBus() {
  return {
    publish: vi.fn(),
    subscribe: vi.fn(),
  }
}
