import Session from '../contracts/session'

export default class SessionChanged {
  public static id = 'Auth.SessionChanged'
  public constructor(public readonly session: Session | null) {}
}
