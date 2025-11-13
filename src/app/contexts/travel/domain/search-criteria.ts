import { TravelClass } from '@app/shared/types/travel-class'
import SearchCriteriaPolicy from './policies/search-criteria-policy'
import DistinctOriginDestinationPolicy from './policies/distinct-origin-destination-policy'

/**
 * SearchCriteria properties.
 */
export type SearchCriteriaProps = {
  from: string
  to: string
  travelClass: TravelClass[]
}

/**
 * Represents the criteria used for searching travel options.
 */
export default class SearchCriteria {
  private constructor(private props: SearchCriteriaProps) {}

  get from() {
    return this.props.from
  }

  get to() {
    return this.props.to
  }

  get travelClass(): ReadonlyArray<TravelClass> {
    return this.props.travelClass
  }

  /**
   * Creates a new SearchCriteria instance after validating the provided properties
   * against the given policy.
   * @param props The properties for the SearchCriteria.
   * @param policy The policy to validate the properties against.
   * @returns A new SearchCriteria instance.
   * @throws Error if the properties do not satisfy the policy.
   */
  public static create(
    props: SearchCriteriaProps,
    policy: SearchCriteriaPolicy = new DistinctOriginDestinationPolicy()
  ) {
    policy.validate(props)
    return new SearchCriteria({ ...props })
  }

  /**
   * Rehydrates a SearchCriteria instance from the given properties.
   * @param props The properties to rehydrate the SearchCriteria.
   * @returns A rehydrated SearchCriteria instance.
   */
  public static rehydrate(props: SearchCriteriaProps) {
    return new SearchCriteria({ ...props })
  }
}
