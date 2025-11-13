import PurchasedTravel from '../../domain/purchased-travel'

export default interface BookingProvider {
  purchaseTravelCard(travelCardId: string): Promise<PurchasedTravel>
  purchaseLastMinuteDeal(lastMinuteDealId: string): Promise<PurchasedTravel>
}
