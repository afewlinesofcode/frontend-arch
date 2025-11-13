import { TravelClass } from '@app/shared/types/travel-class'
import PurchasedTravel from '@travel/domain/purchased-travel'
import TravelInfo from '@travel/domain/travel-info'
import { OfferStub } from './offers'

export type PurchaseStub = {
  id: string
  name: string
  purchasedDate: string
}

export type PurchasedTravelStub = PurchaseStub & {
  from: string
  to: string
  date: string
  price: number
  airline: string
  travelClass: TravelClass
  travelId: string
}

export function buildPurchasedTravelStub(
  offerStub: OfferStub,
  purchase: PurchaseStub
): PurchasedTravelStub {
  return {
    id: purchase.id,
    name: purchase.name,
    purchasedDate: purchase.purchasedDate,
    from: offerStub.from,
    to: offerStub.to,
    date: offerStub.date,
    price: offerStub.price,
    airline: offerStub.airline,
    travelClass: offerStub.travelClass,
    travelId: offerStub.id,
  }
}

export function purchasedTravelFromStub(stub: PurchasedTravelStub) {
  return PurchasedTravel.rehydrate({
    id: stub.id,
    purchasedDate: stub.purchasedDate,
    name: stub.name,
    info: TravelInfo.rehydrate({
      from: stub.from,
      to: stub.to,
      date: new Date(stub.date),
      price: stub.price,
      airline: stub.airline,
      travelClass: stub.travelClass,
      offerId: stub.travelId,
    }),
  })
}

export function purchasedTravelDTOFromStub(stub: PurchasedTravelStub) {
  return {
    id: stub.id,
    name: stub.name,
    purchased_date: stub.purchasedDate,
    from: stub.from,
    to: stub.to,
    date: stub.date,
    price: stub.price,
    airline: stub.airline,
    travel_class: stub.travelClass,
    travel_id: stub.travelId,
  }
}
