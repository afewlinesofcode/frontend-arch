import TravelCard from '../contracts/travel-card'
import LastMinuteDeal from '../contracts/last-minute-deal'
import SearchCriteria from '../../domain/search-criteria'

export default interface TravelsProvider {
  searchTravelCards(
    criteria: SearchCriteria
  ): Promise<{ travelCards: TravelCard[]; recentSearches: SearchCriteria[] }>
  getLastMinuteDeals(): Promise<LastMinuteDeal[]>
  getRecentSearches(): Promise<SearchCriteria[]>
}
