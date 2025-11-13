import AppError from './app-error'

export default class EventsError extends AppError {
  public constructor(message: string) {
    super(message, 'Events')
  }
}
