import TravelStatus from '../contracts/travel-status'

export default class TravelStatusChanged {
  public static id = 'Travel.TravelStatusChanged'

  public constructor(
    public readonly key: keyof TravelStatus,
    public readonly value: TravelStatus[typeof key]
  ) {}
}
