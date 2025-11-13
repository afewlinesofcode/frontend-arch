import AppError from '@app/shared/errors/app-error'

export default class DuplicateCredentialsError extends AppError {
  public constructor(message: string) {
    super(message, 'Auth.DuplicateCredentials')
  }
}
