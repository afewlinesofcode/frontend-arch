import AuthStatus from '../contracts/auth-status'
import Session from '../contracts/session'

/**
 * Interface for session management.
 */
export default interface SessionStore {
  /** The current session. */
  session: Session | null

  /** Current status of auth-related operations. */
  status: AuthStatus

  /**
   * Sets the current session.
   * @param session The session to set, or null to clear the session.
   */
  setSession(session: Session | null): void

  /**
   * Sets the current status of a specific auth-related operation.
   * @param key The key of the status to set.
   * @param value The value to set for the specified status key.
   */
  setStatus(key: keyof AuthStatus, value: AuthStatus[typeof key]): void
}
