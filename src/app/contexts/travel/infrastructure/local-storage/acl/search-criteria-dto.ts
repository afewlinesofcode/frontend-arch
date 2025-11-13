import AclError from '@app/shared/errors/acl-error'
import { isTravelClass } from '@/app/shared/types/travel-class'
import SearchCriteria from '../../../domain/search-criteria'

export type SearchCriteriaDTO = {
  from: string
  to: string
  travel_class: string[]
}

export const toSearchCriteriaDTO = (
  criteria: SearchCriteria
): SearchCriteriaDTO => ({
  from: criteria.from,
  to: criteria.to,
  travel_class: [...criteria.travelClass],
})

export const toSearchCriteria = (dto: SearchCriteriaDTO) => {
  return SearchCriteria.create({
    from: dto.from,
    to: dto.to,
    travelClass: dto.travel_class.map((tc) => {
      if (!isTravelClass(tc)) {
        throw new AclError(`Invalid travel class: ${tc}`)
      }
      return tc
    }),
  })
}
