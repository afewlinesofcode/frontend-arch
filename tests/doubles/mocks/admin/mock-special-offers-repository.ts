import { vi } from 'vitest'

export type MockedSpecialOffersRepository = ReturnType<
  typeof mockSpecialOffersRepository
>

export default function mockSpecialOffersRepository() {
  return {
    findAll: vi.fn(),
    findById: vi.fn(),
    add: vi.fn(),
    update: vi.fn(),
  }
}
