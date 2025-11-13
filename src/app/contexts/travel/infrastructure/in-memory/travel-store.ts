import EventBus from '@app/shared/ports/event-bus'
import { PurchasedTravelView } from '../../application/acl/purchased-travel'
import { SearchCriteriaView } from '../../application/acl/search-criteria'
import TravelCard from '../../application/contracts/travel-card'
import TravelStatus from '../../application/contracts/travel-status'
import TravelStore from '../../application/ports/travel-store'
import PurchasedTravelsChanged from '../../application/events/purchased-travels-changed'
import PurchasedTravelUpdated from '../../application/events/purchased-travel-updated'
import PurchasedTravelAdded from '../../application/events/purchased-travel-added'
import RecentSearchesChanged from '../../application/events/recent-searches-changed'
import RecentSearcheAdded from '../../application/events/recent-search-added'
import TravelStatusChanged from '../../application/events/travel-status-changed'
import TravelCardsChanged from '../../application/events/travel-cards-changed'
import SearchCriteriaChanged from '../../application/events/search-criteria-changed'

export default class InMemoryTravelStore implements TravelStore {
  private _searchCriteria: SearchCriteriaView | null = null
  private _travelCards: TravelCard[] = []
  private _purchasedTravels: PurchasedTravelView[] = []
  private _recentSearches: SearchCriteriaView[] = []
  private _status: TravelStatus = {
    isLoadingCards: false,
    isLoadingPurchased: false,
    isLoadingSearches: false,
    isLoadingDeals: false,
  }

  public constructor(private eventBus: EventBus) {}

  public get searchCriteria(): SearchCriteriaView | null {
    return this._searchCriteria
  }

  public get travelCards(): TravelCard[] {
    return this._travelCards
  }

  public get purchasedTravels(): PurchasedTravelView[] {
    return this._purchasedTravels
  }

  public get recentSearches(): SearchCriteriaView[] {
    return this._recentSearches
  }

  public get status(): TravelStatus {
    return this._status
  }

  public setSearchCriteria(criteria: SearchCriteriaView | null) {
    this._searchCriteria = criteria
    this.eventBus.publish(new SearchCriteriaChanged(criteria))
  }

  public setTravelCards(travelCards: TravelCard[]) {
    this._travelCards = travelCards
    this.eventBus.publish(new TravelCardsChanged(travelCards))
  }

  public setPurchasedTravels(purchasedTravels: PurchasedTravelView[]) {
    this._purchasedTravels = purchasedTravels
    this.eventBus.publish(new PurchasedTravelsChanged(purchasedTravels))
  }

  public updatePurchasedTravel(updatedTravel: PurchasedTravelView) {
    this._purchasedTravels = this._purchasedTravels.map((travel) =>
      travel.id === updatedTravel.id ? updatedTravel : travel
    )
    this.eventBus.publish(new PurchasedTravelUpdated(updatedTravel))
  }

  public addPurchasedTravel(newTravel: PurchasedTravelView) {
    this._purchasedTravels.unshift(newTravel)
    this.eventBus.publish(new PurchasedTravelAdded(newTravel))
  }

  public setRecentSearches(recentSearches: SearchCriteriaView[]) {
    this._recentSearches = recentSearches
    this.eventBus.publish(new RecentSearchesChanged(recentSearches))
  }

  public addRecentSearch(recentSearch: SearchCriteriaView) {
    this._recentSearches.unshift(recentSearch)
    this.eventBus.publish(new RecentSearcheAdded(recentSearch))
  }

  public setStatus(
    key: keyof TravelStatus,
    value: TravelStatus[typeof key]
  ): void {
    this._status[key] = value
    this.eventBus.publish(new TravelStatusChanged(key, value))
  }
}
