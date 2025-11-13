import InMemoryLastMinuteDealsStore from '@travel/infrastructure/in-memory/last-minute-deals-store'
import { beforeEach, describe, expect, it } from 'vitest'
import LastMinuteDeal from '@travel/application/contracts/last-minute-deal'
import { TravelClass } from '@app/shared/types/travel-class'
import mockEventBus from '../../../doubles/mocks/mock-event-bus'

describe('LastMinuteDealsStore', function () {
  const eventBus = mockEventBus()
  let store: InMemoryLastMinuteDealsStore

  beforeEach(function () {
    store = new InMemoryLastMinuteDealsStore(eventBus)
  })

  it('should return an empty array when no deals are stored', function () {
    expect(store.deals).toEqual([])
  })

  it('should add new deals and return them', function () {
    const dealsToAdd: LastMinuteDeal[] = [
      {
        id: '1',
        from: 'NYC',
        to: 'LAX',
        date: '2024-06-01T12:00:00Z',
        price: 300,
        airline: 'AirlineA',
        travelClass: TravelClass.Economy,
        travelId: 'T1',
        description: 'Special deal to LAX',
      },
      {
        id: '2',
        from: 'NYC',
        to: 'SFO',
        date: '2024-06-02T12:00:00Z',
        price: 350,
        airline: 'AirlineB',
        travelClass: TravelClass.Business,
        travelId: 'T2',
        description: 'Special deal to SFO',
      },
    ]

    const addedDeals = store.addDeals(dealsToAdd)
    expect(addedDeals).toEqual(dealsToAdd)

    expect(store.deals).toEqual(dealsToAdd.reverse())
  })

  it('should not add duplicate deals based on id', function () {
    const initialDeals: LastMinuteDeal[] = [
      {
        id: '1',
        from: 'NYC',
        to: 'LAX',
        date: '2024-06-01T12:00:00Z',
        price: 300,
        airline: 'AirlineA',
        travelClass: TravelClass.Economy,
        travelId: 'T1',
        description: 'Special deal to LAX',
      },
    ]

    store.addDeals(initialDeals)

    const duplicateDeals: LastMinuteDeal[] = [
      {
        id: '1', // Duplicate ID
        from: 'NYC',
        to: 'LAX',
        date: '2024-06-02T12:00:00Z',
        price: 400,
        airline: 'AirlineA',
        travelClass: TravelClass.Economy,
        travelId: 'T1',
        description: 'Another deal to LAX',
      },
      {
        id: '2',
        from: 'NYC',
        to: 'SFO',
        date: '2024-06-02T12:00:00Z',
        price: 350,
        airline: 'AirlineB',
        travelClass: TravelClass.Business,
        travelId: 'T2',
        description: 'Special deal to SFO',
      },
    ]

    const addedDeals = store.addDeals(duplicateDeals)
    expect(addedDeals).toEqual([
      {
        id: '2',
        from: 'NYC',
        to: 'SFO',
        date: '2024-06-02T12:00:00Z',
        price: 350,
        airline: 'AirlineB',
        travelClass: TravelClass.Business,
        travelId: 'T2',
        description: 'Special deal to SFO',
      },
    ])

    expect(store.deals).toEqual([
      {
        id: '2',
        from: 'NYC',
        to: 'SFO',
        date: '2024-06-02T12:00:00Z',
        price: 350,
        airline: 'AirlineB',
        travelClass: TravelClass.Business,
        travelId: 'T2',
        description: 'Special deal to SFO',
      },
      {
        id: '1',
        from: 'NYC',
        to: 'LAX',
        date: '2024-06-01T12:00:00Z',
        price: 300,
        airline: 'AirlineA',
        travelClass: TravelClass.Economy,
        travelId: 'T1',
        description: 'Special deal to LAX',
      },
    ])
  })
})
