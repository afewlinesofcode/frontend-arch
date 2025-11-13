import { AuthApi } from '@auth/interface/api'
import { TravelApi } from '@travel/interface/api'
import Session from '@auth/application/contracts/session'
import SessionChanged from '@auth/application/events/session-changed'
import EventBus from '../shared/ports/event-bus'

/**
 * Process responsible for initializing the user session after login.
 */
export default class InitSessionProcess {
  private session: Session | null = null

  /**
   * Creates an instance of InitSessionProcess.
   * @param deps The use cases required for the process.
   * @param eventBus The event bus for subscribing to events.
   */
  public constructor(
    private authApi: AuthApi,
    private travelApi: TravelApi,
    private eventBus: EventBus
  ) {}

  public async start(): Promise<void> {
    this.session = this.authApi.getSession()

    this.eventBus.subscribe(SessionChanged, (event: SessionChanged) => {
      this.session = event.session
      this.handleSession()
    })

    this.handleSession()
  }

  /**
   * Handles session change events.
   * @param event The session changed event.
   */
  private handleSession(): void {
    if (!this.session) {
      return
    }

    this.travelApi.getRecentSearches()
    this.travelApi.getPurchasedTravels()
    this.travelApi.getLastMinuteDeals()
  }
}
