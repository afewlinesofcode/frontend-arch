import AppError from '@app/shared/errors/app-error'

export default class SameOriginDestinationError extends AppError {
  public constructor(message: string) {
    super(message, 'Travel.SameOriginDestination')
  }
}
