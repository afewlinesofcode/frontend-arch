import { AuthStatus, Session } from './auth'
import {
  LastMinuteDeal,
  PurchasedTravel,
  SearchCriteria,
  TravelCard,
  TravelStatus,
} from './travel'

interface AuthHooksContext {
  useSession: () => Session | null
  useStatus: (key: keyof AuthStatus) => AuthStatus[typeof key]
}

interface TravelHooksContext {
  useSearchCriteria: () => SearchCriteria | null
  useTravelCards: () => TravelCard[]
  usePurchasedTravels: () => PurchasedTravel[]
  useRecentSearches: () => SearchCriteria[]
  useLastMinuteDeals: () => LastMinuteDeal[]
  useNewLastMinuteDeals: () => LastMinuteDeal[]
  useStatus: (key: keyof TravelStatus) => TravelStatus[typeof key]
}

export interface AppContext<Api> {
  api: Api
  auth: AuthHooksContext
  travel: TravelHooksContext
}
