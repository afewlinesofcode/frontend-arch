import { SearchCriteriaView } from '../acl/search-criteria'

export default class SearchCriteriaChanged {
  public static id = 'Travel.SearchCriteriaChanged'
  public constructor(public readonly criteria: SearchCriteriaView | null) {}
}
