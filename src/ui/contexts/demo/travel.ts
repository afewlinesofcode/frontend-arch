import {
  LastMinuteDeal,
  PurchasedTravel,
  SearchCriteria,
  TravelCard,
  TravelStatus,
} from '@/ui/contracts/travel'
import { TravelClass } from '@/ui/shared/enums/travel-class'
import Reactive, { useReactiveValue } from './reactive'
import sleep from '../../shared/lib/sleep'

const travelCardTemplate: TravelCard = {
  id: '1',
  from: 'New York',
  to: 'London',
  date: '2024-11-15T09:00:00.000Z',
  airline: 'British Airways',
  travelClass: TravelClass.Economy,
  price: 499.99,
}

const lastMinuteDealTemplate: LastMinuteDeal = {
  id: '1',
  from: 'Los Angeles',
  to: 'Tokyo',
  date: '2024-10-01T12:00:00.000Z',
  airline: 'Japan Airlines',
  travelClass: TravelClass.Business,
  price: 899.99,
  travelId: '101',
  description: 'Limited time offer for business class travelers!',
}

const purchasedTravelTemplate: PurchasedTravel = {
  id: '1',
  from: 'Chicago',
  to: 'Paris',
  date: '2024-09-20T15:00:00.000Z',
  airline: 'Air France',
  travelClass: TravelClass.First,
  price: 1299.99,
  travelId: '202',
  purchasedDate: '2024-06-01T10:00:00.000Z',
  name: 'My travel',
}

const state = {
  searchCriteria: new Reactive(null as SearchCriteria | null),
  travelCards: new Reactive([] as TravelCard[]),
  purchasedTravels: new Reactive([] as PurchasedTravel[]),
  recentSearches: new Reactive([] as SearchCriteria[]),
  lastMinuteDeals: new Reactive([] as LastMinuteDeal[]),
  newLastMinuteDeals: new Reactive([] as LastMinuteDeal[]),
  travelStatus: new Reactive({
    isLoadingCards: false,
    isLoadingPurchased: false,
    isLoadingSearches: false,
    isLoadingDeals: false,
  } as TravelStatus),
}

function useSearchCriteria() {
  return useReactiveValue(state.searchCriteria)
}

function useTravelCards() {
  return useReactiveValue(state.travelCards)
}

function usePurchasedTravels() {
  return useReactiveValue(state.purchasedTravels)
}

function useRecentSearches() {
  return useReactiveValue(state.recentSearches)
}

function useLastMinuteDeals() {
  return useReactiveValue(state.lastMinuteDeals)
}

function useNewLastMinuteDeals() {
  return useReactiveValue(state.newLastMinuteDeals)
}

function useStatus(key: keyof TravelStatus) {
  return useReactiveValue(state.travelStatus)[key]
}

export default function composeTravel() {
  return {
    api: {
      async searchTravels(criteria: SearchCriteria) {
        if (criteria.from === criteria.to) {
          throw new Error('From and To locations cannot be the same.')
        }

        state.searchCriteria.value = criteria

        // emulate loading
        state.travelStatus.value = {
          ...state.travelStatus.value,
          isLoadingCards: true,
        }
        await sleep(1000)
        state.travelStatus.value = {
          ...state.travelStatus.value,
          isLoadingCards: false,
        }

        // add to recent searches
        state.recentSearches.value = [
          criteria,
          ...state.recentSearches.value.slice(0, 3),
        ]
        state.travelCards.value = Array.from(
          { length: Math.floor(Math.random() * 5) },
          () => ({
            ...travelCardTemplate,
            id: crypto.randomUUID(),
          })
        )
      },
      async purchaseTravel(command: { travelId: string }) {
        state.purchasedTravels.value = [
          ...state.purchasedTravels.value,
          {
            ...purchasedTravelTemplate,
            travelId: command.travelId,
            id: crypto.randomUUID(),
          },
        ]
      },
      async purchaseLastMinuteDeal(command: { lastMinuteDealId: string }) {
        state.purchasedTravels.value = [
          ...state.purchasedTravels.value,
          {
            ...purchasedTravelTemplate,
            travelId: command.lastMinuteDealId,
            id: crypto.randomUUID(),
          },
        ]
      },
      async renamePurchasedTravel(command: {
        travelId: string
        newName: string
      }) {
        state.purchasedTravels.value = state.purchasedTravels.value.map(
          (travel) =>
            travel.id === command.travelId
              ? { ...travel, name: command.newName }
              : travel
        )
      },
      addLastMinuteDeal() {
        const deal = {
          ...lastMinuteDealTemplate,
          id: crypto.randomUUID(),
        }

        state.lastMinuteDeals.value = [...state.lastMinuteDeals.value, deal]
        state.newLastMinuteDeals.value = [deal]
      },
      setStatus(key: keyof TravelStatus, value: TravelStatus[typeof key]) {
        state.travelStatus.value = { ...state.travelStatus.value, [key]: value }
      },
    },
    react: {
      useSearchCriteria,
      useTravelCards,
      usePurchasedTravels,
      useRecentSearches,
      useLastMinuteDeals,
      useNewLastMinuteDeals,
      useStatus,
    },
  }
}
