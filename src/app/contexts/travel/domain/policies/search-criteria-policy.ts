import { SearchCriteriaProps } from '../search-criteria'

/**
 * Policy interface for validating SearchCriteria properties.
 */
export default interface SearchCriteriaPolicy {
  validate(props: SearchCriteriaProps): void
}
