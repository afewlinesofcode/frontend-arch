import { beforeEach, describe, expect, it } from 'vitest'
import StorageDataProvider from '@/app/contexts/travel/infrastructure/local-storage/storage-data-provider'
import mockStorage, { StorageMock } from '@tests/doubles/mocks/mock-storage'
import {
  travelOffersStub,
  offerDTOsFromStub,
} from '@tests/doubles/stubs/offers'
import {
  specialOffersStub,
  specialOfferDTOsFromStub,
} from '@tests/doubles/stubs/special-offers'

describe('StorageDataProvider', function () {
  let dataProvider: StorageDataProvider
  let storage: StorageMock

  beforeEach(function () {
    storage = mockStorage()

    dataProvider = new StorageDataProvider(storage)
  })

  describe('getOffers', function () {
    it('should retrieve all offers from storage', function () {
      storage.getItem.mockReturnValue(
        JSON.stringify(offerDTOsFromStub(travelOffersStub))
      )
      const offers = dataProvider.getOffers()
      expect(offers).toEqual(offerDTOsFromStub(travelOffersStub))
    })
  })

  describe('getOfferById', function () {
    it('should retrieve a specific offer by its ID', function () {
      storage.getItem.mockReturnValue(
        JSON.stringify(offerDTOsFromStub(travelOffersStub))
      )
      const offer = dataProvider.getOfferById('2')
      expect(offer).toEqual(offerDTOsFromStub(travelOffersStub)[1])
    })

    it('should return null if the offer is not found', function () {
      storage.getItem.mockReturnValue(
        JSON.stringify(offerDTOsFromStub(travelOffersStub))
      )
      const offer = dataProvider.getOfferById('999')
      expect(offer).toBeNull()
    })
  })

  describe('getSpecialOffers', function () {
    it('should retrieve all special offers from storage', function () {
      storage.getItem.mockReturnValue(
        JSON.stringify(specialOfferDTOsFromStub(specialOffersStub))
      )
      const specialOffers = dataProvider.getSpecialOffers()
      expect(specialOffers).toEqual(specialOfferDTOsFromStub(specialOffersStub))
    })
  })

  describe('getSpecialOfferById', function () {
    it('should retrieve a specific special offer by its ID', function () {
      storage.getItem.mockReturnValue(
        JSON.stringify(specialOfferDTOsFromStub(specialOffersStub))
      )
      const specialOffer = dataProvider.getSpecialOfferById('2')
      expect(specialOffer).toEqual(
        specialOfferDTOsFromStub(specialOffersStub)[1]
      )
    })

    it('should return null if the special offer is not found', function () {
      storage.getItem.mockReturnValue(
        JSON.stringify(specialOfferDTOsFromStub(specialOffersStub))
      )
      const specialOffer = dataProvider.getSpecialOfferById('s999')
      expect(specialOffer).toBeNull()
    })
  })

  describe('addRecentSearch', function () {
    it('should add a recent search to the current user profile', function () {
      storage.getItem.mockImplementation((key: string) => {
        if (key === 'session') {
          return JSON.stringify({
            email: 'test@example.com',
            name: 'Test User',
          })
        }

        if (key === 'profile:test@example.com') {
          return null
        }
      })

      dataProvider.addRecentSearch({
        from: 'City A',
        to: 'City B',
        travel_class: ['economy'],
      })

      expect(storage.setItem).toHaveBeenCalledWith(
        'profile:test@example.com',
        JSON.stringify({
          recent_searches: [
            {
              from: 'City A',
              to: 'City B',
              travel_class: ['economy'],
            },
          ],
          purchases: [],
        })
      )
    })
  })

  describe('getRecentSearches', function () {
    it('should retrieve recent searches made by the current user', function () {
      const recentSearchesStub = [
        {
          from: 'City A',
          to: 'City B',
          travel_class: ['economy'],
        },
        {
          from: 'City C',
          to: 'City D',
          travel_class: ['business'],
        },
      ]

      storage.getItem.mockImplementation((key: string) => {
        if (key === 'session') {
          return JSON.stringify({
            email: 'test@example.com',
            name: 'Test User',
          })
        }

        if (key === 'profile:test@example.com') {
          return JSON.stringify({
            recent_searches: [...recentSearchesStub],
            purchases: [],
          })
        }
      })

      const recentSearches = dataProvider.getRecentSearches()
      expect(recentSearches).toEqual(recentSearchesStub)
    })
  })

  describe('addPurchase', function () {
    it('should add a purchase to the current user profile', function () {
      storage.getItem.mockImplementation((key: string) => {
        if (key === 'session') {
          return JSON.stringify({
            email: 'test@example.com',
            name: 'Test User',
          })
        }

        if (key === 'profile:test@example.com') {
          return JSON.stringify({
            recent_searches: [],
            purchases: [],
          })
        }
      })

      const purchasedTravelDTO = {
        id: 'purchase1',
        from: 'City A',
        to: 'City B',
        date: '2024-12-01T00:00:00.000Z',
        price: 150,
        airline: 'Airline1',
        travel_class: 'economy' as const,
        travel_id: 'offer1',
        purchased_date: '2024-11-01T10:00:00.000Z',
        name: 'Holiday to City B',
      }

      dataProvider.addPurchase(purchasedTravelDTO)

      expect(storage.setItem).toHaveBeenCalledWith(
        'profile:test@example.com',
        JSON.stringify({
          recent_searches: [],
          purchases: [purchasedTravelDTO],
        })
      )
    })
  })

  describe('getPurchases', function () {
    it('should retrieve purchases made by the current user', function () {
      const purchasedTravels = [
        {
          id: 'purchase1',
          from: 'City A',
          to: 'City B',
          date: '2024-12-01T00:00:00.000Z',
          price: 150,
          airline: 'Airline1',
          travel_class: 'economy' as const,
          travel_id: 'offer1',
          purchased_date: '2024-11-01T10:00:00.000Z',
        },
        {
          id: 'purchase2',
          from: 'City C',
          to: 'City D',
          date: '2024-12-02T00:00:00.000Z',
          price: 250,
          airline: 'Airline2',
          travel_class: 'business' as const,
          travel_id: 'offer2',
          purchased_date: '2024-11-02T11:00:00.000Z',
        },
      ]

      storage.getItem.mockImplementation((key: string) => {
        if (key === 'session') {
          return JSON.stringify({
            email: 'test@example.com',
            name: 'Test User',
          })
        }

        if (key === 'profile:test@example.com') {
          return JSON.stringify({
            recent_searches: [],
            purchases: [...purchasedTravels],
          })
        }
      })

      const purchases = dataProvider.getPurchases()
      expect(purchases).toEqual(purchasedTravels)
    })
  })

  describe('updatePurchase', function () {
    it('should update a purchase made by the current user', function () {
      const existingPurchases = [
        {
          id: 'purchase1',
          from: 'City A',
          to: 'City B',
          date: '2024-12-01T00:00:00.000Z',
          price: 150,
          airline: 'Airline1',
          travel_class: 'economy' as const,
          travel_id: 'offer1',
          purchased_date: '2024-11-01T10:00:00.000Z',
          name: 'Travel 1',
        },
      ]

      storage.getItem.mockImplementation((key: string) => {
        if (key === 'session') {
          return JSON.stringify({
            email: 'test@example.com',
            name: 'Test User',
          })
        }

        if (key === 'profile:test@example.com') {
          return JSON.stringify({
            recent_searches: [],
            purchases: [...existingPurchases],
          })
        }
      })

      const updatedPurchase = {
        id: 'purchase1',
        from: 'City A',
        to: 'City B',
        date: '2024-12-01T00:00:00.000Z',
        price: 175,
        airline: 'Airline1',
        travel_class: 'economy' as const,
        travel_id: 'offer1',
        purchased_date: '2024-11-01T10:00:00.000Z',
        name: 'Holiday to City B - Updated',
      }

      dataProvider.updatePurchase(updatedPurchase)

      expect(storage.setItem).toHaveBeenCalledWith(
        'profile:test@example.com',
        JSON.stringify({
          recent_searches: [],
          purchases: [updatedPurchase],
        })
      )
    })
  })
})
