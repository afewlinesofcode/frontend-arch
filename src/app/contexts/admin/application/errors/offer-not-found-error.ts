import AppError from '@app/shared/errors/app-error'

export default class OfferNotFoundError extends AppError {
  public constructor(message: string) {
    super(message, 'Admin.OfferNotFound')
  }
}
