export default class AppError extends Error {
  public readonly code

  public constructor(message: string, code: string = 'AppError') {
    super(message)
    this.code = code
  }
}
