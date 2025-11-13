import { UpdateSpecialOfferCommand } from '../special-offers-service'
import ValidationError from '@app/shared/errors/validation-error'

export default function assertUpdateSpecialOfferCommand(
  command: UpdateSpecialOfferCommand
) {
  if (!('id' in command)) {
    throw new ValidationError("Missing 'id' field")
  }

  if (!('offerId' in command)) {
    throw new ValidationError("Missing 'offerId' field")
  }

  if (!('description' in command)) {
    throw new ValidationError("Missing 'description' field")
  }

  if (!('specialPrice' in command)) {
    throw new ValidationError("Missing 'specialPrice' field")
  }
}
