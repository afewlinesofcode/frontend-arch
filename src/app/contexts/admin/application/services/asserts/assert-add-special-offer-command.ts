import { AddSpecialOfferCommand } from '../special-offers-service'
import ValidationError from '@app/shared/errors/validation-error'

export default function assertAddSpecialOfferCommand(
  command: AddSpecialOfferCommand
) {
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
