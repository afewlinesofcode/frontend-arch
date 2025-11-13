import { vi } from 'vitest'

export type MockedOffersRepository = ReturnType<typeof mockOffersRepository>

export default function mockOffersRepository() {
  return {
    findAll: vi.fn(),
    findById: vi.fn(),
    findByIds: vi.fn(),
    add: vi.fn(),
    update: vi.fn(),
  }
}
