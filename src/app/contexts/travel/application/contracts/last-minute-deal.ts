import { TravelClass } from '@app/shared/types/travel-class'

/**
 * Represents a travel card with special price and details about a specific travel option.
 */
export default interface LastMinuteDeal {
  id: string
  from: string
  to: string
  date: string
  price: number
  airline: string
  travelClass: TravelClass
  travelId: string
  description: string
}
