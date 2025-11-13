import EventBus from '@app/shared/ports/event-bus'
import LastMinuteDeal from '../../application/contracts/last-minute-deal'
import LastMinuteDealsStore from '../../application/ports/last-minute-deals-store'
import LastMinuteDealsChanged from '../../application/events/last-minute-deals-changed'
import LastMinuteDealsAdded from '../../application/events/last-minute-deals-added'

export default class InMemoryLastMinuteDealsStore
  implements LastMinuteDealsStore
{
  /** Array to store last-minute deals ordered */
  private _deals: LastMinuteDeal[] = []

  /** Map to store deals by their ID for quick lookup */
  private _dealsMap: Map<string, LastMinuteDeal> = new Map()

  public constructor(private eventBus: EventBus) {}

  /** Gets all stored last-minute deals. */
  public get deals(): LastMinuteDeal[] {
    return this._deals
  }

  /**
   * Sets the last-minute deals in the store.
   * @param deals The array of last-minute deals to set.
   */
  public setDeals(deals: LastMinuteDeal[]) {
    this._deals = deals
    this._dealsMap.clear()

    for (const deal of deals) {
      this._dealsMap.set(deal.id, deal)
    }

    this.eventBus.publish(new LastMinuteDealsChanged(this._deals))
  }

  /**
   * Adds new last-minute deals to the store.
   * Only deals that are not already present are added.
   * @param deals
   * @returns
   */
  public addDeals(deals: LastMinuteDeal[]): LastMinuteDeal[] {
    const newDeals = deals.filter((deal) => !this._dealsMap.has(deal.id))

    if (newDeals.length > 0) {
      for (const deal of newDeals) {
        this._dealsMap.set(deal.id, deal)
        this._deals.unshift(deal)
      }

      this.eventBus.publish(new LastMinuteDealsAdded(newDeals))
    }

    return newDeals
  }
}
