import { beforeEach, describe, expect, it } from 'vitest'
import RegisterUser from '@auth/application/use-cases/register-user'
import mockAuthGateway, {
  AuthGatewayMock,
} from '@tests/doubles/mocks/auth/mock-auth-gateway'
import mockSessionProv, {
  SessionProvMock,
} from '@tests/doubles/mocks/auth/mock-session-store'
import mockSessionStore, {
  SessionStoreMock,
} from '@tests/doubles/mocks/auth/mock-session-provider'

describe('RegisterUser', function () {
  let authGateway: AuthGatewayMock
  let sessionProv: SessionProvMock
  let sessionStore: SessionStoreMock
  let registerUser: RegisterUser

  beforeEach(function () {
    authGateway = mockAuthGateway()
    sessionProv = mockSessionProv()
    sessionStore = mockSessionStore()
    registerUser = new RegisterUser(authGateway, sessionProv, sessionStore)
  })

  it('should register in auth gateway', async function () {
    await registerUser.execute({
      email: 'test@example.com',
      name: 'Test User',
      password: 'securepassword',
    })

    expect(authGateway.register).toHaveBeenCalledWith({
      email: 'test@example.com',
      name: 'Test User',
      password: 'securepassword',
    })
  })

  it('should save session in provider', async function () {
    await registerUser.execute({
      email: 'test@example.com',
      name: 'Test User',
      password: 'securepassword',
    })

    expect(sessionStore.setSession).toHaveBeenCalledWith({
      email: 'test@example.com',
      name: 'Test User',
    })

    expect(sessionStore.session).toEqual({
      email: 'test@example.com',
      name: 'Test User',
    })
  })
})
