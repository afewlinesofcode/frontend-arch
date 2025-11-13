import TravelStore from '../ports/travel-store'
import PurchasedTravelsRepository from '../ports/purchased-travels-repository'
import {
  PurchasedTravelView,
  toPurchasedTravelView,
} from '../acl/purchased-travel'
import PurchasedTravelNotFoundError from '../errors/purchased-travel-not-found-error'

export type RenamePurchasedTravelCommand = {
  travelId: string
  newName: string
}

export type RenamePurchasedTravelResponse = {
  purchasedTravel: PurchasedTravelView
}

export default class RenamePurchasedTravel {
  public constructor(
    private purchasedTravelsRepository: PurchasedTravelsRepository,
    private travelStore: TravelStore
  ) {}

  public async execute(
    command: RenamePurchasedTravelCommand
  ): Promise<RenamePurchasedTravelResponse> {
    const purchasedTravel = await this.purchasedTravelsRepository.findById(
      command.travelId
    )
    if (!purchasedTravel) {
      throw new PurchasedTravelNotFoundError(command.travelId)
    }

    purchasedTravel.rename(command.newName)

    const updatedPurchasedTravel =
      await this.purchasedTravelsRepository.update(purchasedTravel)

    const travelView = toPurchasedTravelView(updatedPurchasedTravel)
    this.travelStore.updatePurchasedTravel(travelView)

    return {
      purchasedTravel: travelView,
    }
  }
}
