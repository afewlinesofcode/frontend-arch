import SessionStore from '@/app/contexts/auth/application/ports/session-store'
import AuthGateway from '../ports/auth-gateway'
import SessionProvider from '../ports/session-provider'
import assertRegisterUserCommand from './asserts/assert-register-user-command'

export interface RegisterUserCommand {
  email: string
  name: string
  password: string
}

/**
 * Use case for registering a new user.
 */
export default class RegisterUser {
  /**
   * Creates an instance of RegisterUser.
   * @param authGateway - The authentication gateway for user registration.
   * @param sessionProvider - The session provider for managing user sessions.
   * @param sessionStore - The session store for storing user sessions.
   */
  public constructor(
    private authGateway: AuthGateway,
    private sessionProvider: SessionProvider,
    private sessionStore: SessionStore
  ) {}

  /**
   * Executes the user registration process.
   * @param command - The command containing user registration details.
   */
  public async execute(command: RegisterUserCommand) {
    assertRegisterUserCommand(command)

    const response = await this.authGateway.register({
      email: command.email,
      name: command.name,
      password: command.password,
    })

    const session = {
      email: response.user.email,
      name: response.user.name,
    }

    await this.sessionProvider.save(session)
    this.sessionStore.setSession(session)
  }
}
