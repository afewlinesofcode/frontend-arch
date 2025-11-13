export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
}

export interface AuthResponse {
  user: {
    email: string
    name: string
  }
}

export default interface AuthGateway {
  login(request: LoginRequest): Promise<AuthResponse>
  register(request: RegisterRequest): Promise<AuthResponse>
}
