import Session from '../contracts/session'

export default interface SessionProvider {
  save(session: Session | null): Promise<void>
  restore(): Promise<Session | null>
  delete(): Promise<void>
}
