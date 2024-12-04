import { SortDirection } from 'src/core/shared/domain/repository/search-params';
import { Supplier } from 'src/core/suppliers/domain/supplier.aggregate';

export interface SearchSuppliersPageQuery {
  page?: number;
  pageSize?: number;
  filter?: {
    isActive?: boolean;
    name?: string;
  };
  sort?: string;
  sortDir?: SortDirection | null;
}

export interface SearchSuppliersPageResult {
  total: number;
  currentPage: number;
  perPage: number;
  items: Supplier[];
}
