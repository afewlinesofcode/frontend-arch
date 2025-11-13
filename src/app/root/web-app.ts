import composeAdminApi from '@admin/interface/api'
import LocalStorageAuthGateway from '@auth/infrastructure/local-storage/auth-gateway'
import LocalStorageSessionProvider from '@auth/infrastructure/local-storage/session-provider'
import InMemorySessionStore from '@auth/infrastructure/in-memory/session-store'
import LocalStorageOfferRepository from '@admin/infrastructure/local-storage/offer-repository'
import LocalStorageSpecialOfferRepository from '@admin/infrastructure/local-storage/special-offer-repository'
import makeRequireAuthMiddleware from '@auth/middleware/require-auth'
import composeAuthApi from '@auth/interface/api'
import composeAuthHooks from '@auth/interface/react/hooks'
import LocalStorageTravelProvider from '@travel/infrastructure/local-storage/travels-provider'
import StorageDataProvider from '@travel/infrastructure/local-storage/storage-data-provider'
import LocalStorageBookingProvider from '@travel/infrastructure/local-storage/booking-provider'
import InMemoryTravelStore from '@travel/infrastructure/in-memory/travel-store'
import InMemoryLastMinuteDealsStore from '@travel/infrastructure/in-memory/last-minute-deals-store'
import LocalStoragePurchasedTravelsRepository from '@travel/infrastructure/local-storage/purchased-travels-repository'
import composeTravelApi from '@travel/interface/api'
import composeTravelHooks from '@travel/interface/react/hooks'
import EventEmitterEventBus from '../shared/infrastructure/event-emitter-event-bus'
import InitSessionProcess from '../processes/init-session-process'
import InitProcess from '../processes/init-process'

export default function composeWebApp() {
  // Infrastructure
  const offersRepository = new LocalStorageOfferRepository()
  const specialOffersRepository = new LocalStorageSpecialOfferRepository()
  const authGateway = new LocalStorageAuthGateway()
  const sessionProvider = new LocalStorageSessionProvider()
  const travelDataProvider = new StorageDataProvider(localStorage)
  const travelProvider = new LocalStorageTravelProvider(travelDataProvider)
  const bookingProvider = new LocalStorageBookingProvider(travelDataProvider)
  const purchasedTravelsRepository = new LocalStoragePurchasedTravelsRepository(
    travelDataProvider
  )
  const eventBus = new EventEmitterEventBus()
  const travelStore = new InMemoryTravelStore(eventBus)
  const lastMinuteDealsStore = new InMemoryLastMinuteDealsStore(eventBus)
  const sessionStore = new InMemorySessionStore(eventBus)

  // Middleware
  const requireAuthMiddleware = makeRequireAuthMiddleware(sessionStore)

  // APIs
  const admin = composeAdminApi(offersRepository, specialOffersRepository)
  const auth = composeAuthApi(authGateway, sessionProvider, sessionStore)
  const travel = composeTravelApi(
    purchasedTravelsRepository,
    travelProvider,
    bookingProvider,
    travelStore,
    lastMinuteDealsStore,
    requireAuthMiddleware
  )

  // Orchestration Processes
  const processes = [
    new InitSessionProcess(auth, travel, eventBus),
    new InitProcess(auth, travel),
  ]

  processes.forEach((process) => process.start())

  return {
    api: {
      admin,
      auth,
      travel,
    },
    stores: {
      auth: sessionStore,
      travel: travelStore,
    },
    processes,
    react: {
      auth: composeAuthHooks(sessionStore, eventBus),
      travel: composeTravelHooks(travelStore, lastMinuteDealsStore, eventBus),
    },
  }
}
