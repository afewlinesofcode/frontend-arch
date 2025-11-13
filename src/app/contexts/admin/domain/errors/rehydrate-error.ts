import AppError from '@app/shared/errors/app-error'

export default class RehydrateError extends AppError {
  public constructor(message: string) {
    super(message, 'TravelAdmin.Rehydrate')
  }
}
