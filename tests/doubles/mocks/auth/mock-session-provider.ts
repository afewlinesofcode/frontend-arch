import { vi } from 'vitest'
import AuthStatus from '@auth/application/contracts/auth-status'
import Session from '@auth/application/contracts/session'

export type SessionStoreMock = ReturnType<typeof mockSessionStore>

export default function mockSessionStore() {
  const sessionContainer: { session: Session | null; status: AuthStatus } = {
    session: null,
    status: { isLoading: false },
  }

  return {
    get session() {
      return sessionContainer.session
    },
    get status() {
      return sessionContainer.status
    },
    setSession: vi.fn().mockImplementation((session: Session | null) => {
      sessionContainer.session = session
    }),
    setStatus: vi
      .fn()
      .mockImplementation(
        (key: keyof AuthStatus, value: AuthStatus[typeof key]) => {
          sessionContainer.status[key] = value
        }
      ),
  }
}
