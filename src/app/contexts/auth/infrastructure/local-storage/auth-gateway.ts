import DuplicateCredentialsError from '../../application/errors/duplicate-credentials-error'
import InvalidCredentialsError from '../../application/errors/invalid-credentials-error'
import AuthGateway, {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from '../../application/ports/auth-gateway'

type Record = {
  email: string
  name: string
  password: string
}

export default class LocalStorageAuthGateway implements AuthGateway {
  private STORAGE_KEY = 'auth'
  private data: Record[] = []

  public constructor(private storage: Storage = localStorage) {
    this.loadFromStorage()
  }

  public async login(request: LoginRequest): Promise<AuthResponse> {
    const auth = this.data.find(
      ({ email, password }) =>
        email === request.email && password === request.password
    )

    if (!auth) {
      throw new InvalidCredentialsError('Invalid email or password')
    }

    return {
      user: {
        email: auth.email,
        name: auth.name,
      },
    }
  }

  public async register(request: RegisterRequest): Promise<AuthResponse> {
    const existingAuth = this.data.find(
      (record) => record.email === request.email
    )

    if (existingAuth) {
      throw new DuplicateCredentialsError('User already exists')
    }

    this.data.push({
      email: request.email,
      name: request.name,
      password: request.password,
    })

    this.saveToStorage()

    return {
      user: {
        email: request.email,
        name: request.name,
      },
    }
  }

  private loadFromStorage() {
    const data = this.storage.getItem(this.STORAGE_KEY)

    if (data) {
      this.data = JSON.parse(data)
    }
  }

  private saveToStorage() {
    this.storage.setItem(this.STORAGE_KEY, JSON.stringify(this.data))
  }
}
