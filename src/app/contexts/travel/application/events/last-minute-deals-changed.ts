import LastMinuteDeal from '../contracts/last-minute-deal'

export default class LastMinuteDealsChanged {
  public static id = 'Travel.LastMinuteDealsChanged'
  public constructor(public readonly lastMinuteDeals: LastMinuteDeal[]) {}
}
