import BookingProvider from '../ports/booking-provider'
import { toPurchasedTravelView } from '../acl/purchased-travel'
import TravelStore from '../ports/travel-store'

export interface PurchaseLastMinuteDealCommand {
  lastMinuteDealId: string
}

export default class PurchaseLastMinuteDeal {
  public constructor(
    private bookingProvider: BookingProvider,
    private travelStore: TravelStore
  ) {}

  public async execute(command: PurchaseLastMinuteDealCommand): Promise<void> {
    const travel = await this.bookingProvider.purchaseLastMinuteDeal(
      command.lastMinuteDealId
    )

    const travelView = toPurchasedTravelView(travel)
    this.travelStore.addPurchasedTravel(travelView)
  }
}
