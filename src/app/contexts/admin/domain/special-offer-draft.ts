/**
 * Props of a special offer draft
 */
export type SpecialOfferDraftProps = {
  offerId: string
  specialPrice: number
  description: string
}

/**
 * A new SpecialOfferDraft entity
 */
export default class SpecialOfferDraft<
  T extends SpecialOfferDraftProps = SpecialOfferDraftProps,
> {
  /** SpecialOfferDraft properties */
  protected _props: T

  // Getters for SpecialOfferDraft properties

  public get offerId() {
    return this._props.offerId
  }

  public get specialPrice() {
    return this._props.specialPrice
  }

  public get description() {
    return this._props.description
  }

  /**
   * Protected constructor to prevent direct instantiation
   * @param props SpecialOfferDraft properties
   */
  protected constructor(props: T) {
    this._props = { ...props }
  }

  /**
   * Factory method to create a new SpecialOfferDraft
   * @param props Properties for the new SpecialOfferDraft
   * @returns A new SpecialOfferDraft instance
   */
  public static create(props: SpecialOfferDraftProps) {
    return new SpecialOfferDraft({ ...props })
  }
}
