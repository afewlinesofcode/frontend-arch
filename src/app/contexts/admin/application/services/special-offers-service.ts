import ReferentialIntegrityError from '@app/shared/errors/referential-integrity-error'
import OffersRepository from '../ports/offers-repository'
import SpecialOffersRepository from '../ports/special-offers-repository'
import {
  specialOfferFromAddSpecialOfferCommand,
  specialOfferFromUpdateSpecialOfferCommand,
  SpecialOfferView,
  toSpecialOfferView,
} from '../acl/special-offer'
import SpecialOffer from '../../domain/special-offer'
import Offer from '../../domain/offer'
import assertAddSpecialOfferCommand from './asserts/assert-add-special-offer-command'
import assertUpdateSpecialOfferCommand from './asserts/assert-update-special-offer-command'

export type AddSpecialOfferCommand = {
  offerId: string
  specialPrice: number
  description: string
}

export type UpdateSpecialOfferCommand = AddSpecialOfferCommand & { id: string }

/**
 * Service for managing special offers.
 */
export default class SpecialOffersService {
  /**
   * Creates an instance of SpecialOffersService.
   * @param specialOfferRepository The repository for managing special offers.
   * @param offersRepository The repository for managing offers.
   */
  public constructor(
    private specialOfferRepository: SpecialOffersRepository,
    private offersRepository: OffersRepository
  ) {}

  /**
   * Get all special offers.
   * @returns A list of special offer views.
   * @throws ReferentialIntegrityError if any referenced offers do not exist.
   */
  public async getAll(): Promise<SpecialOfferView[]> {
    const specialOffers = await this.specialOfferRepository.findAll()
    const offersMap = await this.getReferencedOffersMap(specialOffers)

    return specialOffers.map((specialOffer) => {
      return toSpecialOfferView(
        specialOffer,
        offersMap.get(specialOffer.offerId)!
      )
    })
  }

  /**
   * Get a special offer by its ID.
   * @param id The ID of the special offer to retrieve.
   * @returns The special offer view, or null if not found.
   * @throws ReferentialIntegrityError if the referenced offer does not exist.
   */
  public async getById(id: string): Promise<SpecialOfferView | null> {
    const specialOffer = await this.specialOfferRepository.findById(id)

    if (!specialOffer) {
      return null
    }

    const offer = await this.offersRepository.findById(specialOffer.offerId)

    if (!offer) {
      throw new ReferentialIntegrityError(
        `Missing offer for special offer with id: ${id}`
      )
    }

    return toSpecialOfferView(specialOffer, offer)
  }

  /**
   * Add a new special offer.
   * @param command The command containing the details of the special offer to add.
   * @returns The added special offer view.
   * @throws ReferentialIntegrityError if the referenced offer does not exist.
   */
  public async add(command: AddSpecialOfferCommand): Promise<SpecialOfferView> {
    assertAddSpecialOfferCommand(command)

    const offer = await this.offersRepository.findById(command.offerId)

    if (!offer) {
      throw new ReferentialIntegrityError(
        `Cannot add special offer. Offer with id ${command.offerId} does not exist.`
      )
    }

    const newSpecialOffer = await this.specialOfferRepository.add(
      specialOfferFromAddSpecialOfferCommand(command)
    )

    return toSpecialOfferView(newSpecialOffer, offer)
  }

  /**
   * Update an existing special offer.
   * @param command The command containing the updated details of the special offer.
   * @returns The updated special offer view.
   * @throws ReferentialIntegrityError if the referenced offer does not exist.
   */
  public async update(
    command: UpdateSpecialOfferCommand
  ): Promise<SpecialOfferView> {
    assertUpdateSpecialOfferCommand(command)

    const offer = await this.offersRepository.findById(command.offerId)

    if (!offer) {
      throw new ReferentialIntegrityError(
        `Cannot update special offer. Offer with id ${command.offerId} does not exist.`
      )
    }

    const updatedSpecialOffer = await this.specialOfferRepository.update(
      specialOfferFromUpdateSpecialOfferCommand(command)
    )

    return toSpecialOfferView(updatedSpecialOffer, offer)
  }

  /**
   * Get a map of referenced offers for the given special offers.
   */
  private async getReferencedOffersMap(
    specialOffers: SpecialOffer[]
  ): Promise<Map<string, Offer>> {
    const offerIds = [...new Set(specialOffers.map((so) => so.offerId))]
    const offers = await this.offersRepository.findByIds(offerIds)
    const offersMap = new Map(offers.map((offer) => [offer.id, offer]))
    const missingOfferIds = offerIds.filter((id) => !offersMap.has(id))

    if (missingOfferIds.length > 0) {
      throw new ReferentialIntegrityError(
        `Missing offers for special offers: ${missingOfferIds.join(', ')}`
      )
    }

    return offersMap
  }
}
