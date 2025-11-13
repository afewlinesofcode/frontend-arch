import { OfferDTO } from '../acl/offer-dto'
import { PurchasedTravelDTO } from '../acl/purchased-travel-dto'
import { SearchCriteriaDTO } from '../acl/search-criteria-dto'
import { SpecialOfferDTO } from '../acl/special-offer-dto'

/**
 * DataProvider defines the interface for accessing stored travel data
 * required by other providers.
 */
export default interface DataProvider {
  /**
   * Retrieves all offers from storage.
   * @returns Array of offer DTOs.
   */
  getOffers(): OfferDTO[]

  /**
   * Retrieves a specific offer by its ID.
   * @param offerId The ID of the offer to retrieve.
   * @returns The offer DTO or null if not found.
   */
  getOfferById(offerId: string): OfferDTO | null

  /**
   * Retrieves all special offers from storage.
   * @returns Array of special offer DTOs.
   */
  getSpecialOffers(): SpecialOfferDTO[]

  /**
   * Retrieves a specific last-minute deal by its ID.
   * @param dealId The ID of the last-minute deal to retrieve.
   * @returns The special offer DTO or null if not found.
   */
  getSpecialOfferById(dealId: string): SpecialOfferDTO | null

  /**
   * Adds a recent travel search for the current user.
   * @param criteria The search criteria to add.
   */
  addRecentSearch(criteria: SearchCriteriaDTO): SearchCriteriaDTO[]

  /**
   * Retrieves recent travel searches made by the current user.
   * @returns Array of recent travel preferences.
   */
  getRecentSearches(): SearchCriteriaDTO[]

  /**
   * Adds a purchase made by the current user.
   * @param purchase The purchased travel contract to add.
   */
  addPurchase(purchase: PurchasedTravelDTO): void

  /**
   * Retrieves all purchases made by the current user.
   * @returns Array of purchased travel contracts.
   */
  getPurchases(): PurchasedTravelDTO[]

  /**
   * Updates a purchase made by the current user.
   * @param purchase The purchased travel contract to update.
   */
  updatePurchase(purchase: PurchasedTravelDTO): void
}
