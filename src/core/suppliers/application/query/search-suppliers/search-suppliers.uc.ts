import { QueryHandler } from 'src/core/shared/application/query-handler.interface';
import { ISupplierRepository } from 'src/core/suppliers/domain/supplier.repository.interface';
import {
  SearchSuppliersPageQuery,
  SearchSuppliersPageResult,
} from './search-suppliers.uc.dto';
import {
  SupplierSearchParams,
  SupplierSearchResult,
} from 'src/core/suppliers/domain/supplier.search.type';

export class SearchSuppliersUseCase
  implements QueryHandler<SearchSuppliersPageQuery, SearchSuppliersPageResult>
{
  constructor(private readonly supplierRepository: ISupplierRepository) {}

  async execute(
    query: SearchSuppliersPageQuery,
  ): Promise<SearchSuppliersPageResult> {
    const input = new SupplierSearchParams({
      filter: query.filter,
      page: query.page,
      per_page: query.pageSize,
      sort: query.sort,
      sort_dir: query.sortDir,
    });
    const searchResult: SupplierSearchResult =
      await this.supplierRepository.search(input);

    return {
      items: searchResult.items,
      currentPage: searchResult.current_page,
      perPage: searchResult.per_page,
      total: searchResult.total,
    };
  }
}
