import { isTravelClass } from '@/app/shared/types/travel-class'
import OfferDraft from '../../../domain/offer-draft'
import Offer from '../../../domain/offer'
import AclError from '@app/shared/errors/acl-error'

/**
 * Data Transfer Object for Offer entity
 */
export type OfferDTO = {
  id: string
  from: string
  to: string
  date: string
  price: number
  airline: string
  travel_class: string
}

export type OfferDraftDTO = Omit<OfferDTO, 'id'>

export function toOfferDTO(offer: Offer): OfferDTO {
  return {
    id: offer.id,
    from: offer.from,
    to: offer.to,
    date: offer.date.toISOString(),
    price: offer.price,
    airline: offer.airline,
    travel_class: offer.travelClass,
  }
}

export function toOfferDraftDTO(offer: OfferDraft): OfferDraftDTO {
  return {
    from: offer.from,
    to: offer.to,
    date: offer.date.toISOString(),
    price: offer.price,
    airline: offer.airline,
    travel_class: offer.travelClass,
  }
}

export const toOffer = (dto: OfferDTO) => {
  if (!isTravelClass(dto.travel_class)) {
    throw new AclError(`Invalid travel class: ${dto.travel_class}`)
  }

  return Offer.rehydrate({
    id: dto.id,
    from: dto.from,
    to: dto.to,
    date: new Date(dto.date),
    price: dto.price,
    airline: dto.airline,
    travelClass: dto.travel_class,
  })
}
