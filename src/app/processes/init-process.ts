import { AuthApi } from '../contexts/auth/interface/api'
import { TravelApi } from '../contexts/travel/interface/api'

/**
 * Process responsible for initializing the application on startup.
 */
export default class InitProcess {
  public constructor(
    private authApi: AuthApi,
    private travelApi: TravelApi
  ) {}

  public async start(): Promise<void> {
    await this.authApi.restore()
    this.travelApi.lastMinuteDealsWatch.start(5000)
  }
}
