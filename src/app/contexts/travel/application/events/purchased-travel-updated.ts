import { PurchasedTravelView } from '../acl/purchased-travel'

export default class PurchasedTravelUpdated {
  public static id = 'Travel.PurchasedTravelUpdated'
  public constructor(public readonly purchasedTravel: PurchasedTravelView) {}
}
