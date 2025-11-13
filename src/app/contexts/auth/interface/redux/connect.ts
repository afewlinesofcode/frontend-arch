import { Store } from '@reduxjs/toolkit'
import EventBus from '@app/shared/ports/event-bus'
import slice from './slice'
import SessionChanged from '../../application/events/session-changed'

export default function connect(store: Store, eventBus: EventBus) {
  const { dispatch } = store

  eventBus.subscribe(SessionChanged, (event) => {
    dispatch(slice.actions.setSession(event.session))
  })
}
