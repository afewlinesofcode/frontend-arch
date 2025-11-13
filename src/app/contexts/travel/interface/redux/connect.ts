import { Store } from '@reduxjs/toolkit'
import EventBus from '@app/shared/ports/event-bus'
import travelSlice from './slice'
import LastMinuteDealsChanged from '../../application/events/last-minute-deals-changed'
import LastMinuteDealsAdded from '../../application/events/last-minute-deals-added'
import PurchasedTravelsChanged from '../../application/events/purchased-travels-changed'
import PurchasedTravelAdded from '../../application/events/purchased-travel-added'
import PurchasedTravelUpdated from '../../application/events/purchased-travel-updated'

export default function connect(store: Store, eventBus: EventBus) {
  const { dispatch } = store

  eventBus.subscribe(LastMinuteDealsChanged, (event) => {
    dispatch(travelSlice.actions.setLastMinuteDeals(event.lastMinuteDeals))
  })

  eventBus.subscribe(LastMinuteDealsAdded, (event) => {
    dispatch(travelSlice.actions.addLastMinuteDeals(event.lastMinuteDeals))
  })

  eventBus.subscribe(PurchasedTravelsChanged, (event) => {
    dispatch(travelSlice.actions.setPurchasedTravels(event.purchasedTravels))
  })

  eventBus.subscribe(PurchasedTravelAdded, (event) => {
    dispatch(travelSlice.actions.addPurchasedTravel(event.purchasedTravel))
  })

  eventBus.subscribe(PurchasedTravelUpdated, (event) => {
    dispatch(travelSlice.actions.updatePurchasedTravel(event.purchasedTravel))
  })
}
