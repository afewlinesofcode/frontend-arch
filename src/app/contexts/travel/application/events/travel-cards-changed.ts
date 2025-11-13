import TravelCard from '../contracts/travel-card'

export default class TravelCardsChanged {
  public static id = 'Travel.TravelCardsChanged'
  public constructor(public readonly travelCards: TravelCard[]) {}
}
