import { AddOfferCommand } from '../offers-service'
import ValidationError from '@app/shared/errors/validation-error'
import { isTravelClass } from '@/app/shared/types/travel-class'

export default function assertAddOfferCommand(command: AddOfferCommand) {
  if (!('from' in command)) {
    throw new ValidationError("Missing 'from' field")
  }

  if (!('to' in command)) {
    throw new ValidationError("Missing 'to' field")
  }

  if (!('date' in command)) {
    throw new ValidationError("Missing 'date' field")
  }

  if (!('price' in command)) {
    throw new ValidationError("Missing 'price' field")
  }

  if (!('airline' in command)) {
    throw new ValidationError("Missing 'airline' field")
  }

  if (!('travelClass' in command)) {
    throw new ValidationError("Missing 'travelClass' field")
  }

  if (!isTravelClass(command.travelClass)) {
    throw new ValidationError(`Invalid travel class: ${command.travelClass}`)
  }
}
