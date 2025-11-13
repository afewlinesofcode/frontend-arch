import SpecialOffer from '@/app/contexts/admin/domain/special-offer'

export type SpecialOfferStub = {
  id: string
  offerId: string
  specialPrice: number
  description: string
}

export const specialOffersStub: SpecialOfferStub[] = [
  {
    id: '1',
    offerId: '1',
    specialPrice: 80,
    description: 'Special offer for offer 1',
  },
  {
    id: '2',
    offerId: '3',
    specialPrice: 120,
    description: 'Special offer for offer 2',
  },
]

export function specialOfferFromStub(stub: SpecialOfferStub) {
  return SpecialOffer.rehydrate({ ...stub })
}

export function specialOffersFromStub(
  stubs: SpecialOfferStub[]
): SpecialOffer[] {
  return stubs.map(specialOfferFromStub)
}

export function specialOfferDTOFromStub(stub: SpecialOfferStub) {
  return {
    id: stub.id,
    offer_id: stub.offerId,
    special_price: stub.specialPrice,
    description: stub.description,
  }
}

export function specialOfferDTOsFromStub(stubs: SpecialOfferStub[]) {
  return stubs.map(specialOfferDTOFromStub)
}
