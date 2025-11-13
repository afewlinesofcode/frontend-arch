import AppError from '../../../../shared/errors/app-error'

export default class PurchasedTravelNotFoundError extends AppError {
  public constructor(id: string) {
    super(`Purchased travel with id ${id} not found`, 'PurchasedTravelNotFound')
  }
}
