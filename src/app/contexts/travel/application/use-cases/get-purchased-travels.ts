import TravelStore from '../ports/travel-store'
import {
  PurchasedTravelView,
  toPurchasedTravelView,
} from '../acl/purchased-travel'
import PurchasedTravelsRepository from '../ports/purchased-travels-repository'

export type GetPurchasedTravelsResponse = PurchasedTravelView[]

export default class GetPurchasedTravels {
  public constructor(
    private purchasedTravelsRepository: PurchasedTravelsRepository,
    private travelStore: TravelStore
  ) {}

  public async execute(): Promise<GetPurchasedTravelsResponse> {
    const travels = await this.purchasedTravelsRepository.getAll()

    this.travelStore.setPurchasedTravels(travels.map(toPurchasedTravelView))
    return this.travelStore.purchasedTravels
  }
}
