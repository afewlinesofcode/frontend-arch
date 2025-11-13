import SearchCriteria from '../../../domain/search-criteria'
import { OfferDTO } from '../acl/offer-dto'

/**
 * Creates a filter function based on the given travel preferences.
 * @param criteria The travel search criteria to filter by.
 * @returns A function that takes an OfferDTO and returns true if it matches the criteria, false otherwise.
 */
export default function makeSearchFilter(criteria: SearchCriteria) {
  return function (offer: OfferDTO): boolean {
    if (offer.from !== criteria.from) {
      return false
    }

    if (offer.to !== criteria.to) {
      return false
    }

    if (
      criteria.travelClass.length > 0 &&
      !criteria.travelClass.includes(offer.travel_class)
    ) {
      return false
    }

    return true
  }
}
