import BookingProvider from '../ports/booking-provider'
import TravelStore from '../ports/travel-store'
import { toPurchasedTravelView } from '../acl/purchased-travel'

export interface PurchaseTravelCommand {
  travelId: string
}

export default class PurchaseTravel {
  public constructor(
    private bookingProvider: BookingProvider,
    private travelStore: TravelStore
  ) {}

  public async execute(command: PurchaseTravelCommand): Promise<void> {
    const travel = await this.bookingProvider.purchaseTravelCard(
      command.travelId
    )

    const travelView = toPurchasedTravelView(travel)
    this.travelStore.addPurchasedTravel(travelView)
  }
}
