import SameOriginDestinationError from '../errors/same-origin-destination-error'
import { SearchCriteriaProps } from '../search-criteria'
import SearchCriteriaPolicy from './search-criteria-policy'

/**
 * Policy that ensures the origin and destination are distinct.
 */
export default class DistinctOriginDestinationPolicy
  implements SearchCriteriaPolicy
{
  public validate(props: SearchCriteriaProps): void {
    if (props.from === props.to) {
      throw new SameOriginDestinationError(
        'Origin and destination must be different'
      )
    }
  }
}
