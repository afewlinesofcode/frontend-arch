import PurchasedTravel from '../../domain/purchased-travel'

export default interface PurchasedTravelsRepository {
  /**
   * Retrieves all purchased travels.
   * @returns Array of purchased travels.
   */
  getAll(): Promise<PurchasedTravel[]>

  /**
   * Finds a purchased travel by its ID.
   * @param id The ID of the purchased travel.
   * @returns The purchased travel if found, otherwise null.
   */
  findById(id: string): Promise<PurchasedTravel | null>

  /**
   * Updates an existing purchased travel.
   * @param travel The purchased travel to update.
   * @returns The updated purchased travel.
   */
  update(travel: PurchasedTravel): Promise<PurchasedTravel>
}
