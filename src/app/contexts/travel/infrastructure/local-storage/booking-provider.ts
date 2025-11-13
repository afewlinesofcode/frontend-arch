import BookingProvider from '../../application/ports/booking-provider'
import PurchasedTravel from '../../domain/purchased-travel'
import {
  PurchasedTravelDTO,
  toPurchasedTravel,
} from './acl/purchased-travel-dto'
import DataProvider from './ports/data-provider'
import OfferNotFoundInStorageError from './errors/offer-not-found-in-storage-error'
import SpecialOfferNotFoundInStorageError from './errors/special-offer-not-found-in-storage-error'
import { OfferDTO } from './acl/offer-dto'
import { SpecialOfferDTO } from './acl/special-offer-dto'

/**
 * LocalStorageBookingProvider implements the BookingProvider interface
 * using local storage as the data source.
 */
export default class LocalStorageBookingProvider implements BookingProvider {
  /**
   * Initializes a new instance of LocalStorageBookingProvider.
   * @param dataProvider The data provider to use.
   */
  public constructor(private dataProvider: DataProvider) {}

  /**
   * Purchases a travel card and records it in storage.
   * @param travelCardId The ID of the travel card to purchase.
   * @returns The purchased travel details.
   */
  public async purchaseTravelCard(
    travelCardId: string
  ): Promise<PurchasedTravel> {
    const offerDTO = this.findOfferDTOById(travelCardId)

    const purchasedTravelDTO: PurchasedTravelDTO = {
      id: crypto.randomUUID(),
      from: offerDTO.from,
      to: offerDTO.to,
      date: offerDTO.date,
      price: offerDTO.price,
      airline: offerDTO.airline,
      travel_class: offerDTO.travel_class,
      travel_id: offerDTO.id,
      purchased_date: new Date().toISOString(),
      name: `Travel from ${offerDTO.from} to ${offerDTO.to}`,
    }

    this.dataProvider.addPurchase(purchasedTravelDTO)

    return Promise.resolve(toPurchasedTravel(purchasedTravelDTO))
  }

  /**
   * Purchases a last-minute deal and records it in storage.
   * @param lastMinuteDealId The ID of the last-minute deal to purchase.
   * @returns The purchased travel details.
   */
  public async purchaseLastMinuteDeal(
    lastMinuteDealId: string
  ): Promise<PurchasedTravel> {
    const specialOfferDTO = this.findSpecialOfferDTOById(lastMinuteDealId)
    const offerDTO = this.findOfferDTOById(specialOfferDTO.offer_id)

    const purchasedTravelDTO: PurchasedTravelDTO = {
      id: crypto.randomUUID(),
      from: offerDTO.from,
      to: offerDTO.to,
      date: offerDTO.date,
      price: specialOfferDTO.special_price,
      airline: offerDTO.airline,
      travel_class: offerDTO.travel_class,
      travel_id: offerDTO.id,
      purchased_date: new Date().toISOString(),
      name: `Last minute deal from ${offerDTO.from} to ${offerDTO.to}`,
    }

    this.dataProvider.addPurchase(purchasedTravelDTO)

    return Promise.resolve(toPurchasedTravel(purchasedTravelDTO))
  }

  /**
   * Finds an offer DTO by its ID.
   * @param offerId The ID of the offer to find.
   * @returns The offer DTO.
   * @throws OfferNotFoundInStorageError if the offer is not found.
   */
  private findOfferDTOById(offerId: string): OfferDTO {
    const offerDTO = this.dataProvider.getOfferById(offerId)

    if (!offerDTO) {
      throw new OfferNotFoundInStorageError(
        `Offer with ID ${offerId} not found`
      )
    }
    return offerDTO
  }

  /**
   * Finds a special offer DTO by its ID.
   * @param specialOfferId The ID of the special offer to find.
   * @returns The special offer DTO.
   * @throws SpecialOfferNotFoundInStorageError if the special offer is not found.
   */
  private findSpecialOfferDTOById(specialOfferId: string): SpecialOfferDTO {
    const specialOfferDTO =
      this.dataProvider.getSpecialOfferById(specialOfferId)

    if (!specialOfferDTO) {
      throw new SpecialOfferNotFoundInStorageError(
        `Special offer with ID ${specialOfferId} not found`
      )
    }

    return specialOfferDTO
  }
}
