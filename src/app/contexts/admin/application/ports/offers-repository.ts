import OfferDraft from '../../domain/offer-draft'
import Offer from '../../domain/offer'

export default interface OffersRepository {
  findAll(): Promise<Offer[]>
  findById(id: string): Promise<Offer | null>
  findByIds(ids: string[]): Promise<Offer[]>
  add(offer: OfferDraft): Promise<Offer>
  update(offer: Offer): Promise<Offer>
  clear(): Promise<void>
}
