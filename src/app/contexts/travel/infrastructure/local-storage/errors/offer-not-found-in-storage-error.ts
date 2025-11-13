import AppError from '@app/shared/errors/app-error'

export default class OfferNotFoundInStorageError extends AppError {
  public constructor(message: string) {
    super(message, 'Travel.OfferNotFoundInStorage')
  }
}
