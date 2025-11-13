import { TravelClass } from '@app/shared/types/travel-class'
import TravelCard from '../../../application/contracts/travel-card'

export type OfferDTO = {
  id: string
  from: string
  to: string
  date: string
  price: number
  airline: string
  travel_class: TravelClass
}

export function toTravelCard(dto: OfferDTO): TravelCard {
  return {
    id: dto.id,
    from: dto.from,
    to: dto.to,
    date: dto.date,
    price: dto.price,
    airline: dto.airline,
    travelClass: dto.travel_class,
  }
}
