import SpecialOfferDraft from '../../../domain/special-offer-draft'
import SpecialOffer from '../../../domain/special-offer'

export type SpecialOfferDTO = {
  id: string
  offer_id: string
  special_price: number
  description: string
}

export type SpecialOfferDraftDTO = Omit<SpecialOfferDTO, 'id'>

export function toSpecialOfferDTO(specialOffer: SpecialOffer): SpecialOfferDTO {
  return {
    id: specialOffer.id,
    offer_id: specialOffer.offerId,
    special_price: specialOffer.specialPrice,
    description: specialOffer.description,
  }
}

export function toSpecialOfferDraftDTO(
  specialOffer: SpecialOfferDraft
): SpecialOfferDraftDTO {
  return {
    offer_id: specialOffer.offerId,
    special_price: specialOffer.specialPrice,
    description: specialOffer.description,
  }
}

export function toSpecialOffer(dto: SpecialOfferDTO): SpecialOffer {
  return SpecialOffer.rehydrate({
    id: dto.id,
    offerId: dto.offer_id,
    specialPrice: dto.special_price,
    description: dto.description,
  })
}
