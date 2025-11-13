import LastMinuteDealsStore from '../ports/last-minute-deals-store'
import TravelsProvider from '../ports/travels-provider'

export default class GetLastMinuteDeals {
  public constructor(
    private travelsProvider: TravelsProvider,
    private lastMinuteDealsStore: LastMinuteDealsStore
  ) {}

  public async execute() {
    const deals = await this.travelsProvider.getLastMinuteDeals()
    this.lastMinuteDealsStore.setDeals(deals)

    return deals
  }
}
