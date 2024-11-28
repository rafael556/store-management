import { IRepository } from "./repository.interface";
import { SearchParams } from "./search-params";
import { SearchResult } from "./search-results";

export interface ISearchableRepository<
  E,
  ID,
  Filter = string,
  SearchParamsType = SearchParams<Filter>,
  SearchResultType = SearchResult<E>
> extends IRepository<E, ID> {
  sortableFields: string[];
  search(params: SearchParamsType): Promise<SearchResultType>;
}
