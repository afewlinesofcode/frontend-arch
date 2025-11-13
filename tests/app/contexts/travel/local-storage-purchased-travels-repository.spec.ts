import { beforeEach, describe, expect, it } from 'vitest'
import LocalStoragePurchasedTravelsRepository from '@travel/infrastructure/local-storage/purchased-travels-repository'
import { toPurchasedTravelDTO } from '@travel/infrastructure/local-storage/acl/purchased-travel-dto'
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
import {
  buildPurchasedTravelStub,
  purchasedTravelDTOFromStub,
  purchasedTravelFromStub,
} from '@tests/doubles/stubs/purchased-travel'

describe('LocalStoragePurchasedTravelsRepository', function () {
  let repository: LocalStoragePurchasedTravelsRepository
  let dataProvider: DataProviderMock

  beforeEach(function () {
    dataProvider = mockDataProvider({
      offers: offerDTOsFromStub(travelOffersStub),
      specialOffers: specialOfferDTOsFromStub(specialOffersStub),
      recentSearches: [],
      purchases: [],
    })

    repository = new LocalStoragePurchasedTravelsRepository(dataProvider)
  })

  describe('getAll', function () {
    it('should retrieve all purchases made by the current user', async function () {
      const purchasedTravelStub1 = buildPurchasedTravelStub(
        travelOffersStub[0],
        {
          id: 'purchase1',
          name: 'Travel 1',
          purchasedDate: '2024-11-01T10:00:00.000Z',
        }
      )
      const purchasedTravelStub2 = buildPurchasedTravelStub(
        travelOffersStub[1],
        {
          id: 'purchase2',
          name: 'Travel 2',
          purchasedDate: '2024-11-02T11:00:00.000Z',
        }
      )

      dataProvider.addPurchase(purchasedTravelDTOFromStub(purchasedTravelStub1))
      dataProvider.addPurchase(purchasedTravelDTOFromStub(purchasedTravelStub2))

      const purchases = await repository.getAll()

      expect(purchases.map(toPurchasedTravelDTO)).toEqual([
        {
          id: 'purchase1',
          from: travelOffersStub[0].from,
          to: travelOffersStub[0].to,
          date: travelOffersStub[0].date,
          price: travelOffersStub[0].price,
          airline: travelOffersStub[0].airline,
          travel_class: travelOffersStub[0].travelClass,
          travel_id: travelOffersStub[0].id,
          purchased_date: '2024-11-01T10:00:00.000Z',
          name: 'Travel 1',
        },
        {
          id: 'purchase2',
          from: travelOffersStub[1].from,
          to: travelOffersStub[1].to,
          date: travelOffersStub[1].date,
          price: travelOffersStub[1].price,
          airline: travelOffersStub[1].airline,
          travel_class: travelOffersStub[1].travelClass,
          travel_id: travelOffersStub[1].id,
          purchased_date: '2024-11-02T11:00:00.000Z',
          name: 'Travel 2',
        },
      ])
    })
  })

  describe('findById', function () {
    it('should find a purchased travel by its ID', async function () {
      const purchasedTravelStub = buildPurchasedTravelStub(
        travelOffersStub[0],
        {
          id: 'purchase1',
          name: 'Travel 1',
          purchasedDate: '2024-11-01T10:00:00.000Z',
        }
      )
      const purchasedTravelDTO = purchasedTravelDTOFromStub(purchasedTravelStub)

      dataProvider.addPurchase(purchasedTravelDTO)

      const purchasedTravel = await repository.findById('purchase1')

      expect(purchasedTravel).not.toBeNull()
      expect(toPurchasedTravelDTO(purchasedTravel!)).toEqual(purchasedTravelDTO)
    })

    it('should return null if the purchased travel is not found', async function () {
      const purchasedTravel = await repository.findById('nonexistent-id')

      expect(purchasedTravel).toBeNull()
    })
  })

  describe('update', function () {
    it('should update an existing purchased travel', async function () {
      const purchasedTravelStub = buildPurchasedTravelStub(
        travelOffersStub[0],
        {
          id: 'purchase1',
          name: 'Travel 1',
          purchasedDate: '2024-11-01T10:00:00.000Z',
        }
      )
      const purchasedTravelDTO = purchasedTravelDTOFromStub(purchasedTravelStub)

      dataProvider.addPurchase(purchasedTravelDTO)

      const purchasedTravel = purchasedTravelFromStub(purchasedTravelStub)
      purchasedTravel.rename('Updated Travel 1')
      const updatedPurchasedTravel = await repository.update(purchasedTravel)

      expect(toPurchasedTravelDTO(updatedPurchasedTravel)).toEqual({
        ...purchasedTravelDTO,
        name: 'Updated Travel 1',
      })
    })
  })
})
