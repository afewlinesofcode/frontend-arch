import { TravelClass } from '@app/shared/types/travel-class'
import Offer from '../../domain/offer'
import { AddOfferCommand, UpdateOfferCommand } from '../services/offers-service'

export interface OfferView {
  id: string
  from: string
  to: string
  date: string
  price: number
  airline: string
  travelClass: TravelClass
}

export const offerDraftFromAddOfferCommand = (command: AddOfferCommand) =>
  Offer.create({
    from: command.from,
    to: command.to,
    date: new Date(command.date),
    price: command.price,
    airline: command.airline,
    travelClass: command.travelClass,
  })

export const offerFromUpdateOfferCommand = (command: UpdateOfferCommand) =>
  Offer.rehydrate({
    id: command.id,
    from: command.from,
    to: command.to,
    date: new Date(command.date),
    price: command.price,
    airline: command.airline,
    travelClass: command.travelClass,
  })

export const toOfferView = (offer: Offer): OfferView => ({
  id: offer.id,
  from: offer.from,
  to: offer.to,
  date: offer.date.toISOString(),
  price: offer.price,
  airline: offer.airline,
  travelClass: offer.travelClass,
})
