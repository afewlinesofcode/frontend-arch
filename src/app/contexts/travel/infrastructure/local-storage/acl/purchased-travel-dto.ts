import { TravelClass } from '@app/shared/types/travel-class'
import PurchasedTravel from '../../../domain/purchased-travel'
import TravelInfo from '../../../domain/travel-info'

export type PurchasedTravelDTO = {
  id: string
  from: string
  to: string
  date: string
  price: number
  airline: string
  travel_class: TravelClass
  travel_id: string
  purchased_date: string
  name: string
}

export function toPurchasedTravelDTO(
  purchasedTravel: PurchasedTravel
): PurchasedTravelDTO {
  return {
    id: purchasedTravel.id,
    from: purchasedTravel.info.from,
    to: purchasedTravel.info.to,
    date: purchasedTravel.info.date.toISOString(),
    price: purchasedTravel.info.price,
    airline: purchasedTravel.info.airline,
    travel_class: purchasedTravel.info.travelClass,
    travel_id: purchasedTravel.info.offerId,
    purchased_date: purchasedTravel.purchasedDate,
    name: purchasedTravel.name,
  }
}

export function toPurchasedTravel(dto: PurchasedTravelDTO): PurchasedTravel {
  return PurchasedTravel.rehydrate({
    id: dto.id,
    purchasedDate: dto.purchased_date,
    name: dto.name,
    info: TravelInfo.rehydrate({
      from: dto.from,
      to: dto.to,
      date: new Date(dto.date),
      price: dto.price,
      airline: dto.airline,
      travelClass: dto.travel_class,
      offerId: dto.travel_id,
    }),
  })
}
