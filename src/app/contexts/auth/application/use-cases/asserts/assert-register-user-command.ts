import ValidationError from '@app/shared/errors/validation-error'
import { RegisterUserCommand } from '../register-user'

export default function assertRegisterUserCommand(
  command: RegisterUserCommand
) {
  if (!('email' in command)) {
    throw new ValidationError('Missing email field')
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailRegex.test(command.email)) {
    throw new ValidationError('Invalid email format')
  }

  if (!('name' in command)) {
    throw new ValidationError('Missing name field')
  }

  if (!('password' in command)) {
    throw new ValidationError('Missing password field')
  }
}
