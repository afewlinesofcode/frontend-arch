import { beforeEach, describe, expect, it } from 'vitest'
import LocalStorageBookingProvider from '@travel/infrastructure/local-storage/booking-provider'
import mockDataProvider, {
  DataProviderMock,
} from '@tests/doubles/mocks/travel/mock-data-provider'
import {
  offerDTOsFromStub,
  travelOffersStub,
} from '@tests/doubles/stubs/offers'
import {
  specialOfferDTOsFromStub,
  specialOffersStub,
} from '@tests/doubles/stubs/special-offers'
import { toPurchasedTravelDTO } from '../../../../src/app/contexts/travel/infrastructure/local-storage/acl/purchased-travel-dto'

describe('LocalStorageBookingProvider', function () {
  let dataProvider: DataProviderMock
  let bookingProvider: LocalStorageBookingProvider

  beforeEach(function () {
    dataProvider = mockDataProvider({
      offers: offerDTOsFromStub(travelOffersStub),
      specialOffers: specialOfferDTOsFromStub(specialOffersStub),
      recentSearches: [],
      purchases: [],
    })
    bookingProvider = new LocalStorageBookingProvider(dataProvider)
  })

  describe('purchaseTravelCard', function () {
    it('should purchase a travel card and record it in storage', async function () {
      const purchasedTravel = await bookingProvider.purchaseTravelCard('2')

      const offer = travelOffersStub.find((offer) => offer.id === '2')!
      const purchasedTravelDTO = toPurchasedTravelDTO(purchasedTravel)

      expect(purchasedTravelDTO).toEqual({
        id: expect.any(String),
        from: offer.from,
        to: offer.to,
        date: offer.date,
        price: offer.price,
        airline: offer.airline,
        travel_class: offer.travelClass,
        travel_id: offer.id,
        purchased_date: expect.any(String),
        name: `Travel from ${offer.from} to ${offer.to}`,
      })

      expect(dataProvider.addPurchase).toHaveBeenCalledWith(purchasedTravelDTO)
    })
  })

  describe('purchaseLastMinuteDeal', function () {
    it('should purchase a last-minute deal and record it in storage', async function () {
      const purchasedTravel = await bookingProvider.purchaseLastMinuteDeal('2')

      const offer = travelOffersStub.find((offer) => offer.id === '3')!
      const specialOffer = specialOffersStub.find(
        (special) => special.id === '2'
      )!
      const purchasedTravelDTO = toPurchasedTravelDTO(purchasedTravel)

      expect(purchasedTravelDTO).toEqual({
        id: expect.any(String),
        from: offer.from,
        to: offer.to,
        date: offer.date,
        price: specialOffer.specialPrice,
        airline: offer.airline,
        travel_class: offer.travelClass,
        travel_id: offer.id,
        purchased_date: expect.any(String),
        name: `Last minute deal from ${offer.from} to ${offer.to}`,
      })

      expect(dataProvider.addPurchase).toHaveBeenCalledWith(purchasedTravelDTO)
    })
  })
})
