import SessionStore from '../application/ports/session-store'
import UnauthorizedError from '../application/errors/unauthorized-error'
import { UseCase } from '@app/shared/types/traits'

export type RequireAuthMiddleware = ReturnType<typeof makeRequireAuthMiddleware>

/**
 * Middleware that ensures the user is authenticated before executing the use case.
 * Throws an UnauthorizedError if no session is found.
 */
export default function makeRequireAuthMiddleware(sessionStore: SessionStore) {
  return function requireAuth<TArgs extends unknown[], TResult>(
    useCase: UseCase<TArgs, TResult>
  ) {
    return {
      async execute(...args: TArgs): Promise<TResult> {
        if (!sessionStore.session) {
          throw new UnauthorizedError('User is not authenticated')
        }

        return useCase.execute(...args)
      },
    }
  }
}
