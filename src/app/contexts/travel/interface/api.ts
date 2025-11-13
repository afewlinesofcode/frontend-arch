import {
  SearchTravelsQuery,
  PurchaseTravelCommand,
  PurchaseLastMinuteDealCommand,
  RenamePurchasedTravelCommand,
} from '@travel/application/contracts/api'
import SearchTravels from '../application/use-cases/search-travels'
import TravelsProvider from '../application/ports/travels-provider'
import GetLastMinuteDeals from '../application/use-cases/get-last-minute-deals'
import BookingProvider from '../application/ports/booking-provider'
import PurchaseTravel from '../application/use-cases/purchase-travel'
import PurchaseLastMinuteDeal from '../application/use-cases/purchase-last-minute-deal'
import GetRecentSearches from '../application/use-cases/get-recent-searches'
import LastMinuteDealsWatch from '../application/services/last-minute-deals-watch'
import RenamePurchasedTravel from '../application/use-cases/rename-purchased-travel'
import PurchasedTravelsRepository from '../application/ports/purchased-travels-repository'
import GetPurchasedTravels from '../application/use-cases/get-purchased-travels'
import LastMinuteDealsStore from '../application/ports/last-minute-deals-store'
import TravelStore from '../application/ports/travel-store'
import { RequireAuthMiddleware } from '@/app/contexts/auth/middleware/require-auth'
import makeQueryCacheMiddleware from '@app/shared/middleware/query-cache'

export type TravelApi = ReturnType<typeof composeApi>

export default function composeApi(
  purchasedTravelsRepository: PurchasedTravelsRepository,
  travelsProvider: TravelsProvider,
  bookingProvider: BookingProvider,
  travelStore: TravelStore,
  lastMinuteDealsStore: LastMinuteDealsStore,
  requireAuth: RequireAuthMiddleware
) {
  const queryCache = makeQueryCacheMiddleware()

  const searchTravels = queryCache(
    new SearchTravels(travelsProvider, travelStore),
    { timeout: 60 * 1000 } // Cache results for 1 minute
  )

  const getLastMinuteDeals = new GetLastMinuteDeals(
    travelsProvider,
    lastMinuteDealsStore
  )

  const purchaseTravel = requireAuth(
    new PurchaseTravel(bookingProvider, travelStore)
  )

  const purchaseLastMinuteDeal = requireAuth(
    new PurchaseLastMinuteDeal(bookingProvider, travelStore)
  )

  const getPurchasedTravels = requireAuth(
    new GetPurchasedTravels(purchasedTravelsRepository, travelStore)
  )

  const renamePurchasedTravel = requireAuth(
    new RenamePurchasedTravel(purchasedTravelsRepository, travelStore)
  )

  const getRecentSearches = new GetRecentSearches(travelsProvider, travelStore)

  const lastMinuteDealsWatch = new LastMinuteDealsWatch(
    travelsProvider,
    lastMinuteDealsStore
  )

  return {
    searchTravels: (query: SearchTravelsQuery) => searchTravels.execute(query),

    getLastMinuteDeals: () => getLastMinuteDeals.execute(),

    purchaseTravel: (command: PurchaseTravelCommand) =>
      purchaseTravel.execute(command),

    purchaseLastMinuteDeal: (command: PurchaseLastMinuteDealCommand) =>
      purchaseLastMinuteDeal.execute(command),

    getPurchasedTravels: () => getPurchasedTravels.execute(),

    renamePurchasedTravel: (command: RenamePurchasedTravelCommand) =>
      renamePurchasedTravel.execute(command),

    getRecentSearches: () => getRecentSearches.execute(),

    lastMinuteDealsWatch,
  }
}
