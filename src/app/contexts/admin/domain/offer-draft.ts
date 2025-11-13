import { TravelClass } from '@app/shared/types/travel-class'

/**
 * Props of an offer draft
 */
export type OfferDraftProps = {
  from: string
  to: string
  date: Date
  price: number
  airline: string
  travelClass: TravelClass
}

/**
 * A new OfferDraft entity
 */
export default class OfferDraft<T extends OfferDraftProps = OfferDraftProps> {
  /** Offer properties */
  protected _props: T

  // Getters for OfferDraft properties

  public get from() {
    return this._props.from
  }

  public get to() {
    return this._props.to
  }

  public get date() {
    return new Date(this._props.date)
  }

  public get price() {
    return this._props.price
  }

  public get airline() {
    return this._props.airline
  }

  public get travelClass() {
    return this._props.travelClass
  }

  /**
   * Protected constructor to prevent direct instantiation
   * @param props Offer properties
   */
  protected constructor(props: T) {
    this._props = { ...props }
  }

  /**
   * Factory method to create a new Offer
   */
  public static create(props: OfferDraftProps) {
    return new OfferDraft({ ...props })
  }
}
