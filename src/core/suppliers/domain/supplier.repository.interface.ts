import { ISearchableRepository } from 'src/core/shared/domain/repository/searchable-repository.interface';
import { Supplier } from './supplier.aggregate';
import { ValueObject } from 'src/core/shared/domain/value-object';
import {
  SupplierSearchParams,
  SupplierSearchResult,
} from './supplier.search.type';

export interface ISupplierRepository
  extends ISearchableRepository<
    Supplier,
    ValueObject,
    string,
    SupplierSearchParams,
    SupplierSearchResult
  > {}
