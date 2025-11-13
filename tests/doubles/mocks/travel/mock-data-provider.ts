import { vi } from 'vitest'
import { SearchCriteriaDTO } from '@travel/infrastructure/local-storage/acl/search-criteria-dto'
import { PurchasedTravelDTO } from '@travel/infrastructure/local-storage/acl/purchased-travel-dto'
import { OfferDTO } from '@admin/infrastructure/local-storage/acl/offer-dto'
import { SpecialOfferDTO } from '@admin/infrastructure/local-storage/acl/special-offer-dto'

export type DataProviderMock = ReturnType<typeof mockDataProvider>

export default function mockDataProvider(data: {
  offers: OfferDTO[]
  specialOffers: SpecialOfferDTO[]
  recentSearches: SearchCriteriaDTO[]
  purchases: PurchasedTravelDTO[]
}) {
  return {
    data,

    getOffers: vi.fn().mockReturnValue(data.offers),

    getOfferById: vi
      .fn()
      .mockImplementation(
        (id: string) => data.offers.find((offer) => offer.id === id) || null
      ),

    getSpecialOffers: vi.fn().mockReturnValue(data.specialOffers),

    getSpecialOfferById: vi
      .fn()
      .mockImplementation(
        (id: string) =>
          data.specialOffers.find((specialOffer) => specialOffer.id === id) ||
          null
      ),

    addRecentSearch: vi
      .fn()
      .mockImplementation((criteria: SearchCriteriaDTO) => {
        data.recentSearches.unshift(criteria)
        return data.recentSearches
      }),

    getRecentSearches: vi.fn().mockReturnValue(data.recentSearches),

    addPurchase: vi.fn().mockImplementation((purchase: PurchasedTravelDTO) => {
      data.purchases.push(purchase)
    }),

    getPurchases: vi.fn().mockReturnValue(data.purchases),

    updatePurchase: vi
      .fn()
      .mockImplementation((purchase: PurchasedTravelDTO) => {
        const index = data.purchases.findIndex((p) => p.id === purchase.id)

        if (index !== -1) {
          data.purchases[index] = purchase
        }
      }),
  }
}
