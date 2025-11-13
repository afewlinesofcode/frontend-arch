import { TravelClass } from '@app/shared/types/travel-class'

/**
 * Represents detailed information about a travel offer.
 */
export type TravelInfoProps = {
  offerId: string
  from: string
  to: string
  date: Date
  price: number
  airline: string
  travelClass: TravelClass
}

/**
 * Domain object for travel information.
 */
export default class TravelInfo {
  private constructor(private props: TravelInfoProps) {}

  get offerId() {
    return this.props.offerId
  }

  get from() {
    return this.props.from
  }

  get to() {
    return this.props.to
  }

  get date() {
    return new Date(this.props.date)
  }

  get price() {
    return this.props.price
  }

  get airline() {
    return this.props.airline
  }

  get travelClass() {
    return this.props.travelClass
  }

  /**
   * Rehydrates a TravelInfo instance from the given properties.
   * @param props The properties to rehydrate the TravelInfo.
   * @returns A rehydrated TravelInfo instance.
   */
  public static rehydrate(props: TravelInfoProps) {
    return new TravelInfo({ ...props })
  }
}
