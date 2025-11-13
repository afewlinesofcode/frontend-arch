import SessionStore from '@/app/contexts/auth/application/ports/session-store'
import EventBus from '@app/shared/ports/event-bus'
import {
  makeEventHook,
  makeEventHookForObject,
} from '@/app/shared/interface/react/make-event-hook'
import AuthStatus from '../../application/contracts/auth-status'
import SessionChanged from '../../application/events/session-changed'

export default function composeAuthHooks(
  sessionStore: SessionStore,
  eventBus: EventBus
) {
  return {
    useSession: makeEventHookForObject(() => sessionStore.session, eventBus, [
      SessionChanged,
    ]),
    useStatus: makeEventHook(
      (_event, key: keyof AuthStatus) => sessionStore.status[key],
      eventBus,
      [SessionChanged]
    ),
  }
}
