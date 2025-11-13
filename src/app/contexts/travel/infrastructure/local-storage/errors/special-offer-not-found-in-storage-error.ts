import AppError from '@app/shared/errors/app-error'

export default class SpecialOfferNotFoundInStorageError extends AppError {
  public constructor(message: string) {
    super(message, 'Travel.SpecialOfferNotFoundInStorage')
  }
}
