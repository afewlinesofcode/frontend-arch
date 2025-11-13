import OffersRepository from '@/app/contexts/admin/application/ports/offers-repository'
import OfferNotFoundError from '@/app/contexts/admin/application/errors/offer-not-found-error'
import { OfferDTO, toOfferDTO, toOfferDraftDTO, toOffer } from './acl/offer-dto'
import Offer from '../../domain/offer'
import OfferDraft from '../../domain/offer-draft'

/**
 * Local storage implementation of the OffersRepository
 */
export default class LocalStorageOfferRepository implements OffersRepository {
  /** Local storage key */
  private STORAGE_KEY = 'offers'

  /** In-memory data store */
  private data: OfferDTO[] = []

  /**
   * Initializes the repository and loads data from local storage
   * @param storage Storage mechanism (default: localStorage)
   */
  public constructor(private storage: Storage = localStorage) {
    this.loadFromStorage()
  }

  /**
   * Finds all offers
   * @returns Array of offers
   */
  public async findAll(): Promise<Offer[]> {
    return this.data.map(toOffer)
  }

  /**
   * Finds an offer by its ID
   * @param id Offer ID
   * @returns Offer or null if not found
   */
  public async findById(id: string): Promise<Offer | null> {
    const record = this.data.find((o) => o.id === id)
    return record ? toOffer(record) : null
  }

  /**
   * Finds offers by their IDs
   * @param ids Array of offer IDs
   * @returns Array of offers
   */
  public async findByIds(ids: string[]): Promise<Offer[]> {
    const records = this.data.filter((o) => ids.includes(o.id))
    return records.map(toOffer)
  }

  /**
   * Creates a new offer
   * @param offer Offer to create
   * @returns Created offer
   */
  public async add(offer: OfferDraft): Promise<Offer> {
    const dto: OfferDTO = {
      ...toOfferDraftDTO(offer),
      id: crypto.randomUUID(),
    }

    this.data.push(dto)
    this.saveToStorage()
    return toOffer(dto)
  }

  /**
   * Updates an existing offer
   * @param offer Offer to update
   * @returns Updated offer
   * @throws OfferNotFoundError if the offer does not exist
   */
  public async update(offer: Offer): Promise<Offer> {
    const dto = toOfferDTO(offer)
    const index = this.data.findIndex((o) => o.id === dto.id)

    if (index < 0) {
      throw new OfferNotFoundError(`Offer with id ${dto.id} not found`)
    }

    this.data[index] = dto
    this.saveToStorage()
    return toOffer(dto)
  }

  /**
   * Clears all offers from the repository
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
   * Saves the current data to local storage
   */
  private saveToStorage(): void {
    this.storage.setItem(this.STORAGE_KEY, JSON.stringify(this.data))
  }
}
