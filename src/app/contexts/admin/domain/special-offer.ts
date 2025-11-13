import SpecialOfferDraft, {
  SpecialOfferDraftProps,
} from './special-offer-draft'

/**
 * Props of an existing SpecialOffer
 */
export type SpecialOfferProps = SpecialOfferDraftProps & {
  id: string
}

/**
 * An existing SpecialOffer entity
 */
export default class SpecialOffer extends SpecialOfferDraft<SpecialOfferProps> {
  // Getter for existing SpecialOffer property

  public get id() {
    return this._props.id
  }

  /**
   * Patch the SpecialOffer with new properties
   * @param props New properties for the SpecialOffer excluding id
   */
  public patch(props: Partial<Omit<SpecialOfferProps, 'id'>>) {
    this._props = { ...this._props, ...props }
  }

  /**
   * Rehydrate an existing SpecialOffer from plain object
   * @param props Properties of the existing SpecialOffer
   * @returns A SpecialOffer instance
   */
  public static rehydrate(props: SpecialOfferProps) {
    return new SpecialOffer(props)
  }
}
