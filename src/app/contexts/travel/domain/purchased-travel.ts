import TravelInfo from './travel-info'

/**
 * PurchasedTravel properties.
 */
export type PurchasedTravelProps = {
  id: string
  purchasedDate: string
  name: string
  info: TravelInfo
}

/**
 * Represents a purchased travel with details about the travel and purchase information.
 */
export default class PurchasedTravel {
  private constructor(private _props: PurchasedTravelProps) {}

  public get id(): string {
    return this._props.id
  }

  public get purchasedDate(): string {
    return this._props.purchasedDate
  }

  public get name(): string {
    return this._props.name
  }

  public get info(): TravelInfo {
    return this._props.info
  }

  /**
   * Renames the purchased travel.
   * @param newName The new name for the purchased travel.
   */
  public rename(newName: string) {
    this._props.name = newName
  }

  /**
   * Rehydrates a PurchasedTravel instance from the given properties.
   * @param props The properties to rehydrate the PurchasedTravel.
   * @returns A rehydrated PurchasedTravel instance.
   */
  public static rehydrate(props: PurchasedTravelProps): PurchasedTravel {
    return new PurchasedTravel(props)
  }
}
