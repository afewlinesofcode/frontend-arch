import { TravelClass } from '@app/shared/types/travel-class'
import TravelsProvider from '../ports/travels-provider'
import TravelStore from '../ports/travel-store'
import TravelCard from '../contracts/travel-card'
import {
  searchCriteriaFromSearchTravelsQuery,
  toSearchCriteriaView,
} from '../acl/search-criteria'

export type SearchTravelsQuery = {
  from: string
  to: string
  travelClass: TravelClass[]
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export default class SearchTravels {
  public constructor(
    private travelsProvider: TravelsProvider,
    private travelStore: TravelStore
  ) {}

  public async execute(query: SearchTravelsQuery): Promise<TravelCard[]> {
    const searchCriteria = searchCriteriaFromSearchTravelsQuery(query)

    try {
      this.travelStore.setSearchCriteria(toSearchCriteriaView(searchCriteria))
      this.travelStore.setStatus('isLoadingCards', true)

      await sleep(1000) // Simulate network delay

      const { recentSearches, travelCards } =
        await this.travelsProvider.searchTravelCards(searchCriteria)

      this.travelStore.setTravelCards(travelCards)
      this.travelStore.setRecentSearches(
        recentSearches.map(toSearchCriteriaView)
      )

      return travelCards
    } finally {
      this.travelStore.setStatus('isLoadingCards', false)
    }
  }
}
