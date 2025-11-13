import SessionStore from '@/app/contexts/auth/application/ports/session-store'
import Session from '../contracts/session'

export default class GetSession {
  public constructor(private sessionStore: SessionStore) {}

  public execute(): Session | null {
    const session = this.sessionStore.session

    if (!session) {
      return null
    }

    return {
      ...session,
    }
  }
}
