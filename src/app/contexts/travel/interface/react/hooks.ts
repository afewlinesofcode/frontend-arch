import EventBus from '@app/shared/ports/event-bus'
import {
  makeEventHook,
  makeEventHookForArray,
  makeEventHookForObject,
} from '@/app/shared/interface/react/make-event-hook'
import TravelStore from '../../application/ports/travel-store'
import LastMinuteDealsStore from '../../application/ports/last-minute-deals-store'
import LastMinuteDealsChanged from '../../application/events/last-minute-deals-changed'
import LastMinuteDealsAdded from '../../application/events/last-minute-deals-added'
import PurchasedTravelsChanged from '../../application/events/purchased-travels-changed'
import PurchasedTravelUpdated from '../../application/events/purchased-travel-updated'
import RecentSearchesChanged from '../../application/events/recent-searches-changed'
import RecentSearcheAdded from '../../application/events/recent-search-added'
import TravelCardsChanged from '../../application/events/travel-cards-changed'
import TravelStatus from '../../application/contracts/travel-status'
import TravelStatusChanged from '../../application/events/travel-status-changed'
import PurchasedTravelAdded from '../../application/events/purchased-travel-added'
import SearchCriteriaChanged from '../../application/events/search-criteria-changed'

export default function composeTravelHooks(
  travelStore: TravelStore,
  lastMinuteDealsStore: LastMinuteDealsStore,
  eventBus: EventBus
) {
  return {
    useSearchCriteria: makeEventHookForObject(
      () => travelStore.searchCriteria,
      eventBus,
      [SearchCriteriaChanged]
    ),
    useTravelCards: makeEventHookForArray(
      () => travelStore.travelCards,
      eventBus,
      [TravelCardsChanged]
    ),
    usePurchasedTravels: makeEventHookForArray(
      () => travelStore.purchasedTravels,
      eventBus,
      [PurchasedTravelsChanged, PurchasedTravelAdded, PurchasedTravelUpdated]
    ),
    useRecentSearches: makeEventHookForArray(
      () => travelStore.recentSearches,
      eventBus,
      [RecentSearchesChanged, RecentSearcheAdded]
    ),
    useLastMinuteDeals: makeEventHookForArray(
      () => lastMinuteDealsStore.deals,
      eventBus,
      [LastMinuteDealsChanged, LastMinuteDealsAdded]
    ),
    useNewLastMinuteDeals: makeEventHook(
      (event) => event?.lastMinuteDeals || [],
      eventBus,
      [LastMinuteDealsAdded]
    ),
    useStatus: makeEventHook(
      (_event, key: keyof TravelStatus) => travelStore.status[key],
      eventBus,
      [TravelStatusChanged]
    ),
  }
}
