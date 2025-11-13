import OfferDraft, { OfferDraftProps } from './offer-draft'

/**
 * Props of an existing Offer
 */
export type OfferProps = OfferDraftProps & {
  id: string
}

/**
 * An existing Offer entity
 */
export default class Offer extends OfferDraft<OfferProps> {
  // Getter for existing Offer property

  public get id() {
    return this._props.id
  }

  /**
   * Patches the Offer with new props
   * @param props Updated properties for the Offer
   */
  public patch(props: Partial<Omit<OfferProps, 'id'>>) {
    this._props = { ...this._props, ...props }
  }

  /**
   * Rehydrate an existing Offer from plain object
   * @param props Properties of the existing Offer
   * @returns A Offer instance
   */
  public static rehydrate(props: OfferProps) {
    return new Offer(props)
  }
}
