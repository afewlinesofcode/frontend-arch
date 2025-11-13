import { PurchasedTravelView } from '../acl/purchased-travel'
import { SearchCriteriaView } from '../acl/search-criteria'
import TravelCard from '../contracts/travel-card'
import TravelStatus from '../contracts/travel-status'

/**
 * Interface for the Travel Store.
 */
export default interface TravelStore {
  /** Currently selected search criteria. */
  searchCriteria: SearchCriteriaView | null

  /** All stored travel cards. */
  travelCards: TravelCard[]

  /** All purchased travels. */
  purchasedTravels: PurchasedTravelView[]

  /** All recent search criteria. */
  recentSearches: SearchCriteriaView[]

  /** Current status of travel-related operations. */
  status: TravelStatus

  /**
   * Set the currently selected search criteria.
   * @param criteria The search criteria to set.
   */
  setSearchCriteria(criteria: SearchCriteriaView | null): void

  /**
   * Set the travel cards in the store.
   * @param travelCards The array of travel cards to set.
   */
  setTravelCards(travelCards: TravelCard[]): void

  /**
   * Set the purchased travels in the store.
   * @param purchasedTravels The array of purchased travels to set.
   */
  setPurchasedTravels(purchasedTravels: PurchasedTravelView[]): void

  /**
   * Update an existing purchased travel in the store.
   * @param updatedTravel The purchased travel with updated information.
   */
  updatePurchasedTravel(updatedTravel: PurchasedTravelView): void

  /**
   * Add a new purchased travel to the store.
   * @param newTravel The new purchased travel to add.
   */
  addPurchasedTravel(newTravel: PurchasedTravelView): void

  /**
   * Set the recent search criteria in the store.
   * @param recentSearches The array of recent search criteria to set.
   */
  setRecentSearches(recentSearches: SearchCriteriaView[]): void

  /**
   * Add a new recent search criteria to the store.
   * @param recentSearch The recent search criteria to add.
   */
  addRecentSearch(recentSearch: SearchCriteriaView): void

  /**
   * Set the status of a specific key in the travel store.
   * @param key The key of the status to set.
   * @param value The value to set for the specified status key.
   */
  setStatus(key: keyof TravelStatus, value: TravelStatus[typeof key]): void
}
