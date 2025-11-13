import AppError from './app-error'

export default class AclError extends AppError {
  public constructor(message: string) {
    super(message, 'ACL')
  }
}
