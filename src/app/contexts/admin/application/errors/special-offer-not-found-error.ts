import AppError from '@app/shared/errors/app-error'

export default class SpecialOfferNotFoundError extends AppError {
  public constructor(message: string) {
    super(message, 'Admin.SpecialOfferNotFound')
  }
}
