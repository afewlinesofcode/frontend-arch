import Offer from '../../domain/offer'
import SpecialOffer from '../../domain/special-offer'
import {
  AddSpecialOfferCommand,
  UpdateSpecialOfferCommand,
} from '../services/special-offers-service'
import { OfferView, toOfferView } from './offer'

export type SpecialOfferView = {
  id: string
  offerId: string
  specialPrice: number
  description: string
  offer: OfferView
}

export const specialOfferFromAddSpecialOfferCommand = (
  command: AddSpecialOfferCommand
) =>
  SpecialOffer.create({
    offerId: command.offerId,
    specialPrice: command.specialPrice,
    description: command.description,
  })

export const specialOfferFromUpdateSpecialOfferCommand = (
  command: UpdateSpecialOfferCommand
) =>
  SpecialOffer.rehydrate({
    id: command.id,
    offerId: command.offerId,
    specialPrice: command.specialPrice,
    description: command.description,
  })

export const toSpecialOfferView = (
  specialOffer: SpecialOffer,
  offer: Offer
): SpecialOfferView => ({
  id: specialOffer.id,
  offerId: specialOffer.offerId,
  specialPrice: specialOffer.specialPrice,
  description: specialOffer.description,
  offer: toOfferView(offer),
})
