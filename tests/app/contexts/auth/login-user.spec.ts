import { beforeEach, describe, expect, it } from 'vitest'
import LoginUser from '@auth/application/use-cases/login-user'
import mockAuthGateway, {
  AuthGatewayMock,
} from '@tests/doubles/mocks/auth/mock-auth-gateway'
import mockSessionProv, {
  SessionProvMock,
} from '@tests/doubles/mocks/auth/mock-session-store'
import mockSessionStore, {
  SessionStoreMock,
} from '@tests/doubles/mocks/auth/mock-session-provider'

describe('LoginUser', function () {
  let authGateway: AuthGatewayMock
  let sessionProv: SessionProvMock
  let sessionStore: SessionStoreMock
  let loginUser: LoginUser

  beforeEach(function () {
    authGateway = mockAuthGateway()
    sessionProv = mockSessionProv()
    sessionStore = mockSessionStore()
    loginUser = new LoginUser(authGateway, sessionProv, sessionStore)
  })

  it('should login in auth gateway', async function () {
    await loginUser.execute({
      email: 'test@example.com',
      password: 'securepassword',
    })

    expect(authGateway.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'securepassword',
    })
  })

  it('should update session provider with user info', async function () {
    await loginUser.execute({
      email: 'test@example.com',
      password: 'securepassword',
    })

    expect(sessionStore.setSession).toHaveBeenCalledWith({
      email: 'test@example.com',
      name: 'Mocked User',
    })
  })
})
