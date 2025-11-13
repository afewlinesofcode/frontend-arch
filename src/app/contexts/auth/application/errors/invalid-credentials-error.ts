import AppError from '@app/shared/errors/app-error'

export default class InvalidCredentialsError extends AppError {
  public constructor(message: string) {
    super(message, 'Auth.InvalidCredentials')
  }
}
