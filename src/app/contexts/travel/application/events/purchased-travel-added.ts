import { PurchasedTravelView } from '../acl/purchased-travel'

export default class PurchasedTravelAdded {
  public static id = 'Travel.PurchasedTravelAdded'
  public constructor(public readonly purchasedTravel: PurchasedTravelView) {}
}
