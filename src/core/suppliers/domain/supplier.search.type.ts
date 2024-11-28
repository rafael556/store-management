import { SearchParams } from "src/core/shared/domain/repository/search-params";
import { SearchResult } from "src/core/shared/domain/repository/search-results";
import { Supplier } from "./supplier.aggregate";

export type SupplierSearchFilter = {
    name?: string;
    isActive?: boolean;
  };
  
  export class SupplierSearchParams extends SearchParams<SupplierSearchFilter> {}
  
  export class SupplierSearchResult extends SearchResult<Supplier> {}
  