import LastMinuteDeal from '../contracts/last-minute-deal'

export default class LastMinuteDealsAdded {
  public static id = 'Travel.LastMinuteDealsAdded'
  public constructor(public readonly lastMinuteDeals: LastMinuteDeal[]) {}
}
