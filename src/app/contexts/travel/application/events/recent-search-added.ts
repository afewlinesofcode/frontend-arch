import { SearchCriteriaView } from '../acl/search-criteria'

export default class RecentSearcheAdded {
  public static id = 'Travel.RecentSearchAdded'
  public constructor(public readonly recentSearch: SearchCriteriaView) {}
}
