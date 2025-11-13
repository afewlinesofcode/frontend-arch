import { TravelClass } from '@app/shared/types/travel-class'
import { SpecialOfferStub } from './special-offers'
import { OfferStub } from './offers'

export type LastMinuteDealStub = {
  id: string
  from: string
  to: string
  date: string
  price: number
  airline: string
  travelClass: TravelClass
  travelId: string
}

export function buildLastMinuteDealsStub(
  specialOffersStub: SpecialOfferStub[],
  offersStub: OfferStub[]
): LastMinuteDealStub[] {
  return specialOffersStub
    .map((specialOfferStub) => {
      const offerStub = offersStub.find(
        (offer) => offer.id === specialOfferStub.offerId
      )

      if (!offerStub) {
        return null
      }

      return {
        id: specialOfferStub.id,
        from: offerStub.from,
        to: offerStub.to,
        date: offerStub.date,
        price: specialOfferStub.specialPrice,
        airline: offerStub.airline,
        travelClass: offerStub.travelClass,
        travelId: offerStub.id,
        description: specialOfferStub.description,
      }
    })
    .filter(Boolean) as LastMinuteDealStub[]
}
