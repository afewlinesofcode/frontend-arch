import AppError from './app-error'

export default class ReferentialIntegrityError extends AppError {
  constructor(message: string) {
    super(message, 'ReferentialIntegrity')
  }
}
