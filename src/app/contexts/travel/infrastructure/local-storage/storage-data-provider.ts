import DataProvider from './ports/data-provider'
import { SpecialOfferDTO } from './acl/special-offer-dto'
import { OfferDTO } from './acl/offer-dto'
import UnauthenticatedError from './errors/unauthenticated-error'
import { SearchCriteriaDTO } from './acl/search-criteria-dto'
import { PurchasedTravelDTO } from './acl/purchased-travel-dto'
import Profile from './objects/profile'

/**
 * StorageProvider handles interactions with the local storage for travel-related data.
 */
export default class StorageDataProvider implements DataProvider {
  /**
   * Initializes the storage provider with the given storage mechanism.
   * @param storage The storage mechanism to use (default: localStorage).
   */
  public constructor(private storage: Storage = localStorage) {}

  /**
   * Retrieves all offers from storage.
   * @returns Array of offer DTOs.
   */
  public getOffers() {
    return JSON.parse(this.storage.getItem('offers') || '[]') as OfferDTO[]
  }

  /**
   * Retrieves a specific offer by its ID.
   * @param offerId The ID of the offer to retrieve.
   * @returns The offer DTO or null if not found.
   */
  public getOfferById(offerId: string): OfferDTO | null {
    const offers = this.getOffers()
    const offer = offers.find((offer) => offer.id === offerId)

    if (!offer) {
      return null
    }

    return offer
  }

  /**
   * Retrieves all special offers from storage.
   * @returns Array of special offer DTOs.
   */
  public getSpecialOffers() {
    return JSON.parse(
      this.storage.getItem('specialOffers') || '[]'
    ) as SpecialOfferDTO[]
  }

  /**
   * Retrieves a specific last-minute deal by its ID.
   * @param dealId The ID of the last-minute deal to retrieve.
   * @returns The special offer DTO or null if not found.
   */
  public getSpecialOfferById(dealId: string): SpecialOfferDTO | null {
    const specialOffers = this.getSpecialOffers()
    const specialOffer = specialOffers.find((offer) => offer.id === dealId)

    if (!specialOffer) {
      return null
    }

    return specialOffer
  }

  /**
   * Adds a recent travel search to the current user's profile.
   * @param criteria The search criteria to add.
   * @returns The updated list of recent searches.
   */
  public addRecentSearch(criteria: SearchCriteriaDTO): SearchCriteriaDTO[] {
    const session = this.getCurrentSession()

    if (!session.email) {
      return [] // No active session, just skip
    }

    const profile = this.getProfile(session.email)
    const recentSearches = profile.addRecentSearch(criteria)
    this.saveProfile(session.email, profile)

    return recentSearches
  }

  /**
   * Retrieves recent travel searches made by the current user.
   * @returns Array of recent travel preferences.
   */
  public getRecentSearches(): SearchCriteriaDTO[] {
    const session = this.getCurrentSession()

    if (!session.email) {
      return [] // No active session
    }

    const profile = this.getProfile(session.email)
    return profile.recentSearches
  }

  /**
   * Adds a purchased travel to the current user's profile.
   * @param purchase The purchased travel to add.
   * @throws UnauthenticatedError if there is no active user session.
   */
  public addPurchase(purchase: PurchasedTravelDTO) {
    const session = this.requireSession()
    const profile = this.getProfile(session.email)
    profile.addPurchase(purchase)
    this.saveProfile(session.email, profile)
  }

  /**
   * Retrieves all purchases made by the current user.
   * @returns Array of purchased travels.
   */
  public getPurchases(): PurchasedTravelDTO[] {
    const session = this.getCurrentSession()

    if (!session.email) {
      return [] // No active session
    }

    const profile = this.getProfile(session.email)
    return profile.purchases
  }

  /**
   * Updates a purchase made by the current user.
   * @param purchase The purchased travel contract to update.
   * @throws UnauthenticatedError if there is no active user session.
   */
  public updatePurchase(purchase: PurchasedTravelDTO): void {
    const session = this.requireSession()
    const profile = this.getProfile(session.email)
    profile.updatePurchase(purchase)
    this.saveProfile(session.email, profile)
  }

  /**
   * Retrieves the user's profile from storage.
   * @param email The email of the user.
   * @returns The profile DTO.
   */
  private getProfile(email: string): Profile {
    const data = this.storage.getItem(this.profileKey(email))
    return new Profile(data || '')
  }

  /**
   * Saves the user's profile to storage.
   * @param email The email of the user.
   * @param profile The profile data to save.
   */
  private saveProfile(email: string, profile: Profile) {
    this.storage.setItem(this.profileKey(email), profile.toString())
  }

  /**
   * Retrieves the current app session info from storage.
   * @returns The current session view.
   */
  private getCurrentSession() {
    const session = JSON.parse(this.storage.getItem('session') || '{}')

    return {
      email: session.email || '',
      name: session.name || '',
    }
  }

  /**
   * Generates a storage key for a user's profile based on their email.
   * @param email The email of the user.
   * @returns The storage key for the user's profile.
   */
  private profileKey(email: string): string {
    return `profile:${email}`
  }

  /**
   * Ensures there is an active user session.
   * @returns The current session view.
   * @throws UnauthenticatedError if there is no active user session.
   */
  private requireSession() {
    const session = this.getCurrentSession()

    if (!session.email) {
      throw new UnauthenticatedError('User must be authenticated')
    }

    return session
  }
}
