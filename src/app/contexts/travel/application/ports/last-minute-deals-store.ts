import LastMinuteDeal from '../contracts/last-minute-deal'

/**
 * Interface for the Last Minute Deals Store.
 */
export default interface LastMinuteDealsStore {
  /** All stored last-minute deals. */
  deals: LastMinuteDeal[]

  /**
   * Set the last-minute deals in the store.
   * @param deals The array of last-minute deals to set.
   */
  setDeals(deals: LastMinuteDeal[]): void

  /**
   * Add new last-minute deals to the store.
   * Only deals that are not already present are added.
   * @param deals
   * @returns
   */
  addDeals(deals: LastMinuteDeal[]): LastMinuteDeal[]
}
