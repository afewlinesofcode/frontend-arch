import LastMinuteDeal from '../../../application/contracts/last-minute-deal'
import { OfferDTO } from './offer-dto'

export type SpecialOfferDTO = {
  id: string
  offer_id: string
  special_price: number
  description: string
}

export function toLastMinuteDeal(
  specialOfferDTO: SpecialOfferDTO,
  offerDTO: OfferDTO
): LastMinuteDeal {
  return {
    id: specialOfferDTO.id,
    from: offerDTO.from,
    to: offerDTO.to,
    date: offerDTO.date,
    price: specialOfferDTO.special_price,
    airline: offerDTO.airline,
    travelClass: offerDTO.travel_class,
    travelId: offerDTO.id,
    description: specialOfferDTO.description,
  }
}
