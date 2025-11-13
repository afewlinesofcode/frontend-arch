import TravelsProvider from '../ports/travels-provider'
import LastMinuteDealsStore from '../../application/ports/last-minute-deals-store'

/**
 * Service that watches for new last-minute travel deals.
 * It periodically checks for new deals and publishes events when new deals are found.
 */
export default class LastMinuteDealsWatch {
  /** The ID of the interval timer */
  private intervalId: ReturnType<typeof setInterval> | null = null

  /**
   * Initializes the LastMinuteDealsWatch service.
   * @param travelsProvider The provider to fetch last-minute deals from.
   * @param lastMinuteDealsStore The store to keep track of known last-minute deals.
   * @param eventBus The event bus to publish new deals events.
   */
  public constructor(
    private travelsProvider: TravelsProvider,
    private lastMinuteDealsStore: LastMinuteDealsStore
  ) {}

  /**
   * Starts the last-minute deals watch with the specified interval.
   * @param intervalMs The interval in milliseconds between checks.
   */
  public async start(intervalMs: number) {
    if (this.intervalId) {
      return
    }

    this.intervalId = setInterval(() => this.tick(), intervalMs)
    await this.tick()
  }

  /**
   * Stops the last-minute deals watch.
   */
  public async stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  /**
   * Performs a single check for new last-minute deals.
   */
  private async tick() {
    const deals = await this.travelsProvider.getLastMinuteDeals()
    this.lastMinuteDealsStore.addDeals(deals)
  }
}
