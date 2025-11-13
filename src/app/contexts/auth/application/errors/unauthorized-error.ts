import AppError from '@app/shared/errors/app-error'

export default class UnauthorizedError extends AppError {
  public constructor(message: string) {
    super(message, 'Unauthorized')
  }
}
