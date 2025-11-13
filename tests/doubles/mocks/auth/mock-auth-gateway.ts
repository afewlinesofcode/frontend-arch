import { vi } from 'vitest'
import {
  LoginRequest,
  RegisterRequest,
} from '@auth/application/ports/auth-gateway'

export type AuthGatewayMock = ReturnType<typeof mockAuthGateway>

export default function mockAuthGateway() {
  return {
    login: vi.fn().mockImplementation(async (request: LoginRequest) => ({
      user: {
        email: request.email,
        name: 'Mocked User',
      },
    })),
    register: vi.fn().mockImplementation(async (request: RegisterRequest) => ({
      user: {
        email: request.email,
        name: request.name,
      },
    })),
  }
}
