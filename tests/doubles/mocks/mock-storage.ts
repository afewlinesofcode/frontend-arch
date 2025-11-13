import { vi } from 'vitest'

export type StorageMock = ReturnType<typeof mockStorage>

export default function mockStorage() {
  return {
    length: 0,
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
    key: vi.fn(),
  }
}
