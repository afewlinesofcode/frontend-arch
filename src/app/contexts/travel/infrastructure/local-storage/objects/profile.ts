import { PurchasedTravelDTO } from '../acl/purchased-travel-dto'
import { SearchCriteriaDTO } from '../acl/search-criteria-dto'

type ProfileDTO = {
  recent_searches: SearchCriteriaDTO[]
  purchases: PurchasedTravelDTO[]
}

/**
 * Profile represents a user's travel profile, including recent searches and purchases.
 */
export default class Profile {
  /** The profile data transfer object. */
  private dto: ProfileDTO

  /**
   * Initializes a new instance of Profile.
   * @param stringified The stringified profile DTO.
   */
  public constructor(stringified: string = '') {
    if (stringified) {
      this.dto = JSON.parse(stringified) as ProfileDTO
    } else {
      this.dto = {
        recent_searches: [],
        purchases: [],
      }
    }
  }

  /**
   * Gets the recent searches from the profile.
   */
  public get recentSearches(): SearchCriteriaDTO[] {
    return this.dto.recent_searches
  }

  /**
   * Gets the purchased travels from the profile.
   */
  public get purchases(): PurchasedTravelDTO[] {
    return this.dto.purchases
  }

  /**
   * Adds a recent search to the profile.
   * @param criteria The search criteria to add.
   * @returns The updated list of recent searches.
   */
  public addRecentSearch(criteria: SearchCriteriaDTO): SearchCriteriaDTO[] {
    const existingSearch = this.findExistingSearch(criteria)

    if (existingSearch) {
      return this.prependRecentSearch(existingSearch)
    } else {
      return this.prependRecentSearch(criteria)
    }
  }

  /**
   * Adds a purchase to the profile.
   * @param purchase The purchased travel to add.
   */
  public addPurchase(purchase: PurchasedTravelDTO): void {
    this.dto.purchases.push(purchase)
  }

  /**
   * Updates an existing purchase in the profile.
   * @param purchase The purchased travel to update.
   */
  public updatePurchase(purchase: PurchasedTravelDTO): void {
    this.dto.purchases = this.dto.purchases.map((existingPurchase) =>
      existingPurchase.id === purchase.id ? purchase : existingPurchase
    )
  }

  /**
   * Converts the profile DTO to its string representation.
   * @returns The stringified profile DTO.
   */
  public toString(): string {
    return JSON.stringify(this.dto)
  }

  /**
   * Prepends a recent search to the list, ensuring no duplicates and limiting the list size.
   * @param criteria The search criteria to prepend.
   * @returns The updated list of recent searches.
   */
  private prependRecentSearch(
    criteria: SearchCriteriaDTO
  ): SearchCriteriaDTO[] {
    // Remove if already in the list
    this.dto.recent_searches = this.dto.recent_searches.filter(
      (search) => search !== criteria
    )

    this.dto.recent_searches.unshift(criteria)
    this.dto.recent_searches = this.dto.recent_searches.slice(0, 4) // Keep only last 4 searches

    return this.dto.recent_searches
  }

  /**
   * Finds an existing search that matches the given criteria.
   * @param criteria The search criteria to match.
   * @returns The matching search criteria or undefined if not found.
   */
  private findExistingSearch(criteria: SearchCriteriaDTO) {
    return this.dto.recent_searches.find(
      (search) =>
        search.from === criteria.from &&
        search.to === criteria.to &&
        search.travel_class.length === criteria.travel_class.length &&
        search.travel_class.every(
          (travelClass, index) => travelClass === criteria.travel_class[index]
        )
    )
  }
}
