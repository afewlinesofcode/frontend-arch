import AuthStatus from '../contracts/auth-status'

export default class SessionStatusChanged {
  public static id = 'Auth.SessionStatusChanged'

  public constructor(
    public readonly key: keyof AuthStatus,
    public readonly value: AuthStatus[typeof key]
  ) {}
}
