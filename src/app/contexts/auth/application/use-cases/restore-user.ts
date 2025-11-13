import SessionStore from '@/app/contexts/auth/application/ports/session-store'
import SessionProvider from '../ports/session-provider'

export default class RestoreUser {
  public constructor(
    private sessionProvider: SessionProvider,
    private sessionStore: SessionStore
  ) {}

  public async execute() {
    const session = await this.sessionProvider.restore()

    if (session) {
      this.sessionStore.setSession({
        email: session.email,
        name: session.name,
      })
    } else {
      this.sessionStore.setSession(null)
    }
  }
}
