import { vi } from 'vitest'

export type SessionProvMock = ReturnType<typeof mockSessionProv>

export default function mockSessionProv() {
  return {
    save: vi.fn(),
    restore: vi.fn(),
    delete: vi.fn(),
  }
}
