import ValidationError from '@app/shared/errors/validation-error'
import { LoginUserCommand } from '../login-user'

export default function assertLoginUserCommand(command: LoginUserCommand) {
  if (!('email' in command)) {
    throw new ValidationError('Missing email field')
  }

  if (!('password' in command)) {
    throw new ValidationError('Missing password field')
  }
}
