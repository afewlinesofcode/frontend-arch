import { TravelClass } from '../shared/enums/travel-class'

export interface TravelCard {
  id: string
  from: string
  to: string
  date: string
  price: number
  airline: string
  travelClass: TravelClass
}

export interface PurchasedTravel {
  id: string
  from: string
  to: string
  date: string
  price: number
  airline: string
  travelClass: TravelClass
  travelId: string
  purchasedDate: string
  name: string
}

export interface SearchCriteria {
  from: string
  to: string
  travelClass: TravelClass[]
}

export interface LastMinuteDeal {
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

export interface TravelStatus {
  isLoadingCards: boolean
  isLoadingPurchased: boolean
  isLoadingSearches: boolean
  isLoadingDeals: boolean
}
