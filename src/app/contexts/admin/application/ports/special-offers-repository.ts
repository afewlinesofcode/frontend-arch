import SpecialOfferDraft from '../../domain/special-offer-draft'
import SpecialOffer from '../../domain/special-offer'

export default interface SpecialOffersRepository {
  findAll(): Promise<SpecialOffer[]>
  findById(id: string): Promise<SpecialOffer | null>
  add(offer: SpecialOfferDraft): Promise<SpecialOffer>
  update(offer: SpecialOffer): Promise<SpecialOffer>
  clear(): Promise<void>
}
