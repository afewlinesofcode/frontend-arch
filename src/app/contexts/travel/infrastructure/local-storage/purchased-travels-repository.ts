import PurchasedTravelsRepository from '../../application/ports/purchased-travels-repository'
import PurchasedTravel from '../../domain/purchased-travel'
import {
  toPurchasedTravel,
  toPurchasedTravelDTO,
} from './acl/purchased-travel-dto'
import DataProvider from './ports/data-provider'

/**
 * LocalStorage based implementation of PurchasedTravelsRepository.
 */
export default class LocalStoragePurchasedTravelsRepository
  implements PurchasedTravelsRepository
{
  /**
   * Initializes the repository with the given data provider.
   * @param dataProvider The data provider to use.
   */
  public constructor(private dataProvider: DataProvider) {}

  /**
   * Retrieves all purchased travels.
   * @returns Array of purchased travels.
   */
  public async getAll(): Promise<PurchasedTravel[]> {
    return this.dataProvider.getPurchases().map(toPurchasedTravel)
  }

  /**
   * Finds a purchased travel by its ID.
   * @param id The ID of the purchased travel.
   * @returns The purchased travel if found, otherwise null.
   */
  public async findById(id: string): Promise<PurchasedTravel | null> {
    const purchaseDTO = this.dataProvider
      .getPurchases()
      .find((p) => p.id === id)
    return purchaseDTO ? toPurchasedTravel(purchaseDTO) : null
  }

  /**
   * Updates an existing purchased travel.
   * @param travel The purchased travel to update.
   * @returns The updated purchased travel.
   */
  public async update(travel: PurchasedTravel): Promise<PurchasedTravel> {
    const dto = toPurchasedTravelDTO(travel)
    this.dataProvider.updatePurchase(dto)
    return toPurchasedTravel(dto)
  }
}
