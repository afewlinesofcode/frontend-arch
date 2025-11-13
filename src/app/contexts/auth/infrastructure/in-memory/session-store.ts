import SessionStore from '@/app/contexts/auth/application/ports/session-store'
import EventBus from '@app/shared/ports/event-bus'
import Session from '../../application/contracts/session'
import AuthStatus from '../../application/contracts/auth-status'
import SessionChanged from '../../application/events/session-changed'

export default class InMemorySessionStore implements SessionStore {
  private _session: Session | null = null

  private _status: AuthStatus = { isLoading: false }

  public constructor(private eventBus: EventBus) {}

  public get session(): Session | null {
    return this._session
  }

  public get status(): AuthStatus {
    return this._status
  }

  public setSession(session: Session | null): void {
    this._session = session
    this.eventBus.publish(new SessionChanged(session))
  }

  public setStatus(key: keyof AuthStatus, value: AuthStatus[typeof key]): void {
    this._status[key] = value
  }
}
