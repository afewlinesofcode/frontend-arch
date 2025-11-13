import { beforeEach, describe, expect, it } from 'vitest'
import LocalStorageTravelProvider from '@travel/infrastructure/local-storage/travels-provider'
import SearchCriteria from '@travel/domain/search-criteria'
import { toSearchCriteriaDTO } from '@travel/infrastructure/local-storage/acl/search-criteria-dto'
import { TravelClass } from '@app/shared/types/travel-class'
import mockDataProvider, {
  DataProviderMock,
} from '@tests/doubles/mocks/travel/mock-data-provider'
import {
  offerDTOsFromStub,
  travelCardFromOfferStub,
  travelOffersStub,
} from '@tests/doubles/stubs/offers'
import {
  specialOfferDTOsFromStub,
  specialOffersStub,
} from '@tests/doubles/stubs/special-offers'
import { buildLastMinuteDealsStub } from '@tests/doubles/stubs/last-minute-deals'

describe('LocalStorageTravelProvider', function () {
  let dataProvider: DataProviderMock
  let travelProvider: LocalStorageTravelProvider

  beforeEach(function () {
    dataProvider = mockDataProvider({
      offers: offerDTOsFromStub(travelOffersStub),
      specialOffers: specialOfferDTOsFromStub(specialOffersStub),
      recentSearches: [],
      purchases: [],
    })
    travelProvider = new LocalStorageTravelProvider(dataProvider)
  })

  describe('searchTravelCards', function () {
    it('should search travel cards based on criteria', async function () {
      const criteria = SearchCriteria.create({
        from: 'NYC',
        to: 'LAX',
        travelClass: [TravelClass.Economy],
      })
      const { recentSearches, travelCards } =
        await travelProvider.searchTravelCards(criteria)

      expect(recentSearches).toEqual([criteria])
      expect(travelCards).toHaveLength(1)
      expect(travelCards[0]).toEqual(
        travelCardFromOfferStub(travelOffersStub[0])
      )
    })

    it('should add the search criteria to recent searches', async function () {
      const criteria = SearchCriteria.create({
        from: 'NYC',
        to: 'SFO',
        travelClass: [TravelClass.Economy],
      })
      await travelProvider.searchTravelCards(criteria)
      expect(dataProvider.addRecentSearch).toHaveBeenCalledWith(
        toSearchCriteriaDTO(criteria)
      )
    })
  })

  describe('getLastMinuteDeals', function () {
    it('should retrieve all last-minute deals', async function () {
      const lastMinuteDeals = await travelProvider.getLastMinuteDeals()
      const expectedLastMinuteDeals = buildLastMinuteDealsStub(
        specialOffersStub,
        travelOffersStub
      )
      expect(lastMinuteDeals).toHaveLength(specialOffersStub.length)
      expect(lastMinuteDeals).toEqual(expectedLastMinuteDeals)
    })
  })

  describe('getRecentSearches', function () {
    it('should retrieve recent travel searches', async function () {
      const recentSearches = [
        SearchCriteria.create({
          from: 'NYC',
          to: 'LAX',
          travelClass: [TravelClass.Economy],
        }),
        SearchCriteria.create({
          from: 'SFO',
          to: 'ORD',
          travelClass: [TravelClass.Business],
        }),
      ]
      await travelProvider.searchTravelCards(recentSearches[1])
      await travelProvider.searchTravelCards(recentSearches[0])

      const retrievedSearches = await travelProvider.getRecentSearches()
      expect(retrievedSearches).toEqual(recentSearches)
    })
  })
})
