import { SearchCriteriaView } from '../acl/search-criteria'

export default class RecentSearchesChanged {
  public static id = 'Travel.RecentSearchesChanged'
  public constructor(public readonly recentSearches: SearchCriteriaView[]) {}
}
