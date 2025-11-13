import { TravelClass } from '@app/shared/types/travel-class'
import PurchasedTravel from '../../domain/purchased-travel'
import TravelInfo from '../../domain/travel-info'

export type PurchasedTravelView = {
  id: string
  from: string
  to: string
  date: string
  price: number
  airline: string
  travelClass: TravelClass
  travelId: string
  purchasedDate: string
  name: string
}

export function toPurchasedTravelView(
  purchasedTravel: PurchasedTravel
): PurchasedTravelView {
  return {
    id: purchasedTravel.id,
    from: purchasedTravel.info.from,
    to: purchasedTravel.info.to,
    date: purchasedTravel.info.date.toISOString(),
    price: purchasedTravel.info.price,
    airline: purchasedTravel.info.airline,
    travelClass: purchasedTravel.info.travelClass,
    travelId: purchasedTravel.info.offerId,
    purchasedDate: purchasedTravel.purchasedDate,
    name: purchasedTravel.name,
  }
}

export function toPurchasedTravel(dto: PurchasedTravelView): PurchasedTravel {
  return PurchasedTravel.rehydrate({
    id: dto.id,
    purchasedDate: dto.purchasedDate,
    name: dto.name,
    info: TravelInfo.rehydrate({
      from: dto.from,
      to: dto.to,
      date: new Date(dto.date),
      price: dto.price,
      airline: dto.airline,
      travelClass: dto.travelClass,
      offerId: dto.travelId,
    }),
  })
}
