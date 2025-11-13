import {
  offerDraftFromAddOfferCommand,
  offerFromUpdateOfferCommand,
  OfferView,
  toOfferView,
} from '../acl/offer'
import OffersRepository from '../ports/offers-repository'
import { TravelClass } from '@app/shared/types/travel-class'
import assertAddOfferCommand from './asserts/assert-add-offer-command'
import assertUpdateOfferCommand from './asserts/assert-update-offer-command'

export type AddOfferCommand = {
  from: string
  to: string
  date: string
  price: number
  airline: string
  travelClass: TravelClass
}

export type UpdateOfferCommand = AddOfferCommand & { id: string }

/**
 * Service for managing offers.
 */
export default class OffersService {
  /**
   * Creates an instance of OffersService.
   * @param offersRepository The repository for managing offers.
   */
  public constructor(private offersRepository: OffersRepository) {}

  /**
   * Get all offers.
   * @returns A list of offer views.
   */
  public async getAll(): Promise<OfferView[]> {
    const offers = await this.offersRepository.findAll()
    return offers.map(toOfferView)
  }

  /**
   * Get an offer by its ID.
   * @param id The ID of the offer to retrieve.
   * @returns The offer view, or null if not found.
   */
  public async getById(id: string): Promise<OfferView | null> {
    const offer = await this.offersRepository.findById(id)
    return offer ? toOfferView(offer) : null
  }

  /**
   * Add a new offer.
   * @param command The command containing the details of the offer to add.
   * @returns The added offer view.
   */
  public async add(command: AddOfferCommand): Promise<OfferView> {
    assertAddOfferCommand(command)

    const newOffer = await this.offersRepository.add(
      offerDraftFromAddOfferCommand(command)
    )
    return toOfferView(newOffer)
  }

  /**
   * Update an existing offer.
   * @param command The command containing the updated details of the offer.
   * @returns The updated offer view.
   */
  public async update(command: UpdateOfferCommand): Promise<OfferView> {
    assertUpdateOfferCommand(command)

    const updatedOffer = await this.offersRepository.update(
      offerFromUpdateOfferCommand(command)
    )
    return toOfferView(updatedOffer)
  }
}
