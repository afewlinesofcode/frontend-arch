import Session from '../../application/contracts/session'
import SessionProvider from '../../application/ports/session-provider'

export default class LocalStorageSessionProvider implements SessionProvider {
  private STORAGE_KEY = 'session'

  public async save(session: Session | null): Promise<void> {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(session))
  }

  public async restore(): Promise<Session | null> {
    const data = localStorage.getItem(this.STORAGE_KEY)

    if (!data) {
      return null
    }

    return JSON.parse(data)
  }

  public async delete(): Promise<void> {
    localStorage.removeItem(this.STORAGE_KEY)
  }
}
