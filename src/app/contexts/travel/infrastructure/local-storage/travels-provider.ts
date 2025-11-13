import LastMinuteDeal from '../../application/contracts/last-minute-deal'
import TravelCard from '../../application/contracts/travel-card'
import TravelsProvider from '../../application/ports/travels-provider'
import { SpecialOfferDTO, toLastMinuteDeal } from './acl/special-offer-dto'
import { OfferDTO, toTravelCard } from './acl/offer-dto'
import makeSearchFilter from './filters/make-search-filter'
import SearchCriteria from '../../domain/search-criteria'
import DataProvider from './ports/data-provider'
import {
  toSearchCriteria,
  toSearchCriteriaDTO,
} from './acl/search-criteria-dto'

/**
 * LocalStorageTravelProvider implements the TravelsProvider interface
 * using local storage as the data source.
 */
export default class LocalStorageTravelProvider implements TravelsProvider {
  /**
   * Initializes a new instance of LocalStorageTravelProvider.
   * @param dataProvider The data provider to use.
   */
  public constructor(private dataProvider: DataProvider) {}

  /**
   * Searches for travel cards that match the given preferences.
   * @param criteria The search criteria to use.
   * @returns Array of travel cards that match the criteria.
   */
  public async searchTravelCards(
    criteria: SearchCriteria
  ): Promise<{ travelCards: TravelCard[]; recentSearches: SearchCriteria[] }> {
    const recentSearchDTOs = this.dataProvider.addRecentSearch(
      toSearchCriteriaDTO(criteria)
    )

    const allOffers = this.dataProvider.getOffers()
    const filterByCritera = makeSearchFilter(criteria)

    return {
      recentSearches: recentSearchDTOs.map(toSearchCriteria),
      travelCards: allOffers.filter(filterByCritera).map(toTravelCard),
    }
  }

  /**
   * Retrieves all last-minute deals from storage.
   * @returns Array of last-minute deals.
   */
  public async getLastMinuteDeals(): Promise<LastMinuteDeal[]> {
    const specialOffers = this.dataProvider.getSpecialOffers()
    const offers = this.dataProvider.getOffers()
    const offersMap = this.getOffersMapForSpecialOffers(specialOffers, offers)

    return Promise.resolve(
      specialOffers.map((specialOffer) =>
        toLastMinuteDeal(specialOffer, offersMap.get(specialOffer.offer_id)!)
      )
    )
  }

  /**
   * Retrieves recent travel searches made by the current user.
   * @returns Array of recent travel preferences.
   */
  public async getRecentSearches(): Promise<SearchCriteria[]> {
    return Promise.resolve(
      this.dataProvider.getRecentSearches().map(toSearchCriteria)
    )
  }

  /**
   * Creates a map of offer IDs to OfferDTOs for the given special offers.
   * @param specialOffers Array of special offer DTOs.
   * @param offers Array of offer DTOs.
   * @returns Map of offer IDs to OfferDTOs.
   */
  private getOffersMapForSpecialOffers(
    specialOffers: SpecialOfferDTO[],
    offers: OfferDTO[]
  ) {
    const filteredOffersIds = new Set(
      specialOffers.map((specialOffer) => specialOffer.offer_id)
    )

    return new Map(
      offers
        .filter((offer) => filteredOffersIds.has(offer.id))
        .map((offer) => [offer.id, offer])
    )
  }
}
