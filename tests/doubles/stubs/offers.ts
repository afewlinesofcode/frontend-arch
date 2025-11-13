import Offer from '@app/contexts/admin/domain/offer'
import { TravelClass } from '@app/shared/types/travel-class'

export type OfferStub = {
  id: string
  from: string
  to: string
  date: string
  price: number
  airline: string
  travelClass: TravelClass
}

export const adminOffersStub: OfferStub[] = [
  {
    id: '1',
    from: 'A',
    to: 'B',
    date: '2024-12-01T00:00:00.000Z',
    price: 100,
    airline: 'Airline1',
    travelClass: 'economy',
  },
  {
    id: '2',
    from: 'C',
    to: 'D',
    date: '2024-12-02T00:00:00.000Z',
    price: 200,
    airline: 'Airline2',
    travelClass: 'business',
  },
  {
    id: '3',
    from: 'E',
    to: 'F',
    date: '2024-12-03T00:00:00.000Z',
    price: 300,
    airline: 'Airline3',
    travelClass: 'first',
  },
]

export const travelOffersStub: OfferStub[] = [
  {
    id: '1',
    from: 'NYC',
    to: 'LAX',
    price: 300,
    date: '2024-12-01T00:00:00.000Z',
    airline: 'Delta',
    travelClass: 'economy',
  },
  {
    id: '2',
    from: 'NYC',
    to: 'LAX',
    price: 500,
    date: '2024-12-01T00:00:00.000Z',
    airline: 'American Airlines',
    travelClass: 'business',
  },
  {
    id: '3',
    from: 'NYC',
    to: 'SFO',
    price: 400,
    date: '2024-12-01T00:00:00.000Z',
    airline: 'United',
    travelClass: 'economy',
  },
]

export function offerFromStub(stub: OfferStub): Offer {
  return Offer.rehydrate({ ...stub, date: new Date(stub.date) })
}

export function offersFromStub(stubs: OfferStub[]): Offer[] {
  return stubs.map(offerFromStub)
}

export function offerDTOFromStub(stub: OfferStub) {
  return {
    id: stub.id,
    from: stub.from,
    to: stub.to,
    date: stub.date,
    price: stub.price,
    airline: stub.airline,
    travel_class: stub.travelClass,
  }
}

export function offerDTOsFromStub(stubs: OfferStub[]) {
  return stubs.map(offerDTOFromStub)
}

export function travelCardFromOfferStub(stub: OfferStub) {
  return {
    id: stub.id,
    from: stub.from,
    to: stub.to,
    date: stub.date,
    price: stub.price,
    airline: stub.airline,
    travelClass: stub.travelClass,
  }
}

export function travelCardsFromOfferStubs(stubs: OfferStub[]) {
  return stubs.map(travelCardFromOfferStub)
}
