import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import TravelCard from '../../application/contracts/travel-card'
import LastMinuteDeal from '../../application/contracts/last-minute-deal'
import { SearchCriteriaView } from '../../application/acl/search-criteria'
import { PurchasedTravelView } from '../../application/acl/purchased-travel'

const initialState = {
  lastMinuteDeals: [] as LastMinuteDeal[],
  recentSearches: [] as SearchCriteriaView[],
  travelCards: [] as TravelCard[],
  purchasedTravels: [] as PurchasedTravelView[],
}

export type TravelState = typeof initialState

const travelSlice = createSlice({
  name: 'travel',
  initialState,
  reducers: {
    setLastMinuteDeals(state, action: PayloadAction<LastMinuteDeal[]>) {
      state.lastMinuteDeals = action.payload
    },

    addLastMinuteDeals(state, action: PayloadAction<LastMinuteDeal[]>) {
      state.lastMinuteDeals.push(...action.payload)
    },

    setRecentSearches(state, action: PayloadAction<SearchCriteriaView[]>) {
      state.recentSearches = action.payload
    },

    setTravelCards(state, action: PayloadAction<TravelCard[]>) {
      state.travelCards = action.payload
    },

    setPurchasedTravels(state, action: PayloadAction<PurchasedTravelView[]>) {
      state.purchasedTravels = action.payload
    },

    addPurchasedTravel(state, action: PayloadAction<PurchasedTravelView>) {
      state.purchasedTravels.push(action.payload)
    },

    updatePurchasedTravel(state, action: PayloadAction<PurchasedTravelView>) {
      const index = state.purchasedTravels.findIndex(
        (t) => t.id === action.payload.id
      )
      if (index !== -1) {
        state.purchasedTravels[index] = action.payload
      }
    },
  },
  selectors: {
    getLastMinuteDeals(state) {
      return state.lastMinuteDeals
    },

    getRecentSearches(state) {
      return state.recentSearches
    },

    getTravelCards(state) {
      return state.travelCards
    },

    getPurchasedTravels(state) {
      return state.purchasedTravels
    },
  },
})

export default travelSlice
