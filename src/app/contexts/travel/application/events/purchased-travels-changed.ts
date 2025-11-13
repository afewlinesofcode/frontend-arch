import { PurchasedTravelView } from '../acl/purchased-travel'

export default class PurchasedTravelsChanged {
  public static id = 'Travel.PurchasedTravelsChanged'
  public constructor(public readonly purchasedTravels: PurchasedTravelView[]) {}
}
