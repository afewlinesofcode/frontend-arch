import { TravelClass } from '@app/shared/types/travel-class'
import SearchCriteria from '../../domain/search-criteria'
import { SearchTravelsQuery } from '../use-cases/search-travels'

export type SearchCriteriaView = {
  from: string
  to: string
  travelClass: TravelClass[]
}

export const toSearchCriteriaView = (
  criteria: SearchCriteria
): SearchCriteriaView => ({
  from: criteria.from,
  to: criteria.to,
  travelClass: [...criteria.travelClass],
})

export const searchCriteriaFromSearchTravelsQuery = (
  query: SearchTravelsQuery
) =>
  SearchCriteria.create({
    from: query.from,
    to: query.to,
    travelClass: query.travelClass,
  })
