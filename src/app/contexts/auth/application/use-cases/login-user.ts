import SessionStore from '@/app/contexts/auth/application/ports/session-store'
import AuthGateway from '../ports/auth-gateway'
import SessionProvider from '../ports/session-provider'
import assertLoginUserCommand from './asserts/assert-login-user-command'

export interface LoginUserCommand {
  email: string
  password: string
}

/**
 * Use case for logging in a user.
 */
export default class LoginUser {
  /**
   * Creates an instance of LoginUser.
   * @param authGateway - The authentication gateway for user login.
   * @param sessionStore - The session store for storing user sessions.
   * @param sessionProvider - The session provider for managing user sessions.
   */
  public constructor(
    private authGateway: AuthGateway,
    private sessionProvider: SessionProvider,
    private sessionStore: SessionStore
  ) {}

  /**
   * Executes the user login process.
   * @param command - The command containing user login details.
   */
  public async execute(command: LoginUserCommand) {
    assertLoginUserCommand(command)

    try {
      this.sessionStore.setStatus('isLoading', true)

      const response = await this.authGateway.login({
        email: command.email,
        password: command.password,
      })

      const session = {
        email: response.user.email,
        name: response.user.name,
      }

      await this.sessionProvider.save(session)
      this.sessionStore.setSession(session)
    } finally {
      this.sessionStore.setStatus('isLoading', false)
    }
  }
}
