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

export type TravelClassInfo = (typeof travelClassesInfo)[number]

export const travelClassesInfo: { value: TravelClass; label: string }[] = [
  {
    value: TravelClass.Economy,
    label: 'Economy',
  },
  {
    value: TravelClass.PremiumEconomy,
    label: 'Premium Economy',
  },
  {
    value: TravelClass.Business,
    label: 'Business',
  },
  {
    value: TravelClass.First,
    label: 'First',
  },
]

export function findTravelClassInfoByValue(value: string) {
  return travelClassesInfo.find((item) => item.value === value)
}

export function getTravelClassLabelByValue(value: string) {
  return travelClassesInfo.find((item) => item.value === value)?.label || ''
}

export function isTravelClass(value: unknown): value is TravelClass {
  return typeof value === 'string' && travelClassesSet.has(value as TravelClass)
}
