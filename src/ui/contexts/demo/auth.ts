import { AuthStatus, Session } from '@/ui/contracts/auth'
import Reactive, { useReactiveValue } from './reactive'
import sleep from '../../shared/lib/sleep'

/**
 * State for authentication context.
 */
const state = {
  session: new Reactive(null as Session | null),
  authStatus: new Reactive({ isLoading: false } as AuthStatus),
}

/**
 * Hook to access the current user session.
 * @returns The current session or null if not authenticated.
 */
function useSession() {
  return useReactiveValue(state.session)
}

/**
 * Hook to access authentication status.
 * @param key The key of the AuthStatus to access.
 * @returns The value of the specified AuthStatus key.
 */
function useStatus(key: keyof AuthStatus) {
  return useReactiveValue(state.authStatus)[key]
}

/**
 * Authentication context hook.
 * @returns An object containing authentication app methods and react hooks.
 */
export default function composeAuth() {
  return {
    api: {
      async login(command: { email: string; password: string }) {
        void command
        // emulate loading
        state.authStatus.value = { ...state.authStatus.value, isLoading: true }
        await sleep(1000)
        state.authStatus.value = { ...state.authStatus.value, isLoading: false }
        // set session
        state.session.value = {
          email: command.email,
          name: 'Test User',
        }
      },
      async register(command: {
        name: string
        email: string
        password: string
      }) {
        void command
        throw new Error('Failed to register user. Email already in use.')
      },
    },
    react: {
      useSession,
      useStatus,
    },
  }
}
