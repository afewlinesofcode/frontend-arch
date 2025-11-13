import TravelsProvider from '../ports/travels-provider'
import { toSearchCriteriaView } from '../acl/search-criteria'
import TravelStore from '../ports/travel-store'

export default class GetRecentSearches {
  public constructor(
    private travelsProvider: TravelsProvider,
    private travelStore: TravelStore
  ) {}

  public async execute() {
    const recentSearchCriterias = await this.travelsProvider.getRecentSearches()

    this.travelStore.setRecentSearches(
      recentSearchCriterias.map(toSearchCriteriaView)
    )

    return this.travelStore.recentSearches
  }
}
