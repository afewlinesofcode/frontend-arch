import { TravelClass } from '@app/shared/types/travel-class'

/**
 * Represents a travel card with details about a specific travel option.
 */
export default interface TravelCard {
  id: string
  from: string
  to: string
  date: string
  price: number
  airline: string
  travelClass: TravelClass
}
