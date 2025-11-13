import SpecialOffersRepository from '@/app/contexts/admin/application/ports/special-offers-repository'
import SpecialOfferNotFoundError from '@/app/contexts/admin/application/errors/special-offer-not-found-error'
import {
  SpecialOfferDTO,
  toSpecialOfferDTO,
  toSpecialOfferDraftDTO,
  toSpecialOffer,
} from './acl/special-offer-dto'
import SpecialOffer from '../../domain/special-offer'
import SpecialOfferDraft from '../../domain/special-offer-draft'

/**
 * Local storage implementation of the SpecialOffersRepository
 */
export default class LocalStorageSpecialOfferRepository
  implements SpecialOffersRepository
{
  /** Local storage key */
  private STORAGE_KEY = 'specialOffers'

  /** In-memory data store */
  private data: SpecialOfferDTO[] = []

  /**
   * Initializes the repository and loads data from local storage
   * @param storage Storage mechanism (default: localStorage)
   */
  public constructor(private storage: Storage = localStorage) {
    this.loadFromStorage()
  }

  /**
   * Finds all special offers
   * @returns Array of special offers
   */
  public async findAll(): Promise<SpecialOffer[]> {
    return this.data.map(toSpecialOffer)
  }

  /**
   * Finds a special offer by its ID
   * @param id Special offer ID
   * @returns Special offer or null if not found
   */
  public async findById(id: string): Promise<SpecialOffer | null> {
    const record = this.data.find((o) => o.id === id)
    return record ? toSpecialOffer(record) : null
  }

  /**
   * Creates a new special offer
   * @param specialOffer Special offer to create
   * @returns Created special offer
   */
  public async add(specialOffer: SpecialOfferDraft): Promise<SpecialOffer> {
    const record: SpecialOfferDTO = {
      ...toSpecialOfferDraftDTO(specialOffer),
      id: crypto.randomUUID(),
    }

    this.data.push(record)
    this.saveToStorage()
    return toSpecialOffer(record)
  }

  /**
   * Updates an existing special offer
   * @param specialOffer Special offer to update
   * @returns Updated special offer
   * @throws SpecialOfferNotFoundError if the special offer does not exist
   */
  public async update(specialOffer: SpecialOffer): Promise<SpecialOffer> {
    const record = toSpecialOfferDTO(specialOffer)
    const index = this.data.findIndex((o) => o.id === record.id)

    if (index < 0) {
      throw new SpecialOfferNotFoundError(
        `Special offer with id ${record.id} not found`
      )
    }

    this.data[index] = record
    this.saveToStorage()
    return toSpecialOffer(record)
  }

  /**
   * Clears all special offers from the repository
   */
  public async clear(): Promise<void> {
    this.data = []
    this.saveToStorage()
  }

  /**
   * Loads data from local storage
   */
  private loadFromStorage(): void {
    const data = this.storage.getItem(this.STORAGE_KEY)
    this.data = data ? JSON.parse(data) : []
  }

  /**
   * Saves data to local storage
   */
  private saveToStorage(): void {
    this.storage.setItem(this.STORAGE_KEY, JSON.stringify(this.data))
  }
}
