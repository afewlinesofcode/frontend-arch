import SessionStore from '@/app/contexts/auth/application/ports/session-store'
import {
  RegisterUserCommand,
  LoginUserCommand,
} from '@auth/application/contracts/api'
import AuthGateway from '../application/ports/auth-gateway'
import SessionProvider from '../application/ports/session-provider'
import GetSession from '../application/use-cases/get-session'
import LoginUser from '../application/use-cases/login-user'
import RegisterUser from '../application/use-cases/register-user'
import RestoreUser from '../application/use-cases/restore-user'

export type AuthApi = ReturnType<typeof composeApi>

export default function composeApi(
  authGateway: AuthGateway,
  sessionProvider: SessionProvider,
  sessionStore: SessionStore
) {
  const registerUser = new RegisterUser(
    authGateway,
    sessionProvider,
    sessionStore
  )

  const loginUser = new LoginUser(authGateway, sessionProvider, sessionStore)
  const restoreUser = new RestoreUser(sessionProvider, sessionStore)
  const getSession = new GetSession(sessionStore)

  return {
    register: (command: RegisterUserCommand) => registerUser.execute(command),
    login: (command: LoginUserCommand) => loginUser.execute(command),
    restore: () => restoreUser.execute(),
    getSession: () => getSession.execute(),
  }
}
