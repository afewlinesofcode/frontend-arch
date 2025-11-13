export enum TravelClass {
  Economy = 'economy',
  PremiumEconomy = 'premium_economy',
  Business = 'business',
  First = 'first',
}

export const travelClasses = [
  TravelClass.Economy,
  TravelClass.PremiumEconomy,
  TravelClass.Business,
  TravelClass.First,
]

const travelClassesSet = new Set<TravelClass>(travelClasses)

export function isTravelClass(value: unknown): value is TravelClass {
  return typeof value === 'string' && travelClassesSet.has(value as TravelClass)
}
