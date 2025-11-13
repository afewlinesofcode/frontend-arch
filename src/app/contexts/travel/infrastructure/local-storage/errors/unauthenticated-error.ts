import AppError from '@app/shared/errors/app-error'

export default class UnauthenticatedError extends AppError {
  public constructor(message: string) {
    super(message, 'Travel.Unauthenticated')
  }
}
