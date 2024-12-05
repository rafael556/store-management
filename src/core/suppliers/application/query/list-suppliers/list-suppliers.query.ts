import { QueryHandler } from 'src/core/shared/application/query-handler.interface';
import { ISupplierRepository } from 'src/core/suppliers/domain/supplier.repository.interface';
import { ListSuppliersResult } from './list-suppliers.query.dto';

export class ListSuppliersQueryHandler
  implements QueryHandler<any, ListSuppliersResult>
{
  constructor(private readonly repository: ISupplierRepository) {}

  async execute(input: any = null): Promise<ListSuppliersResult> {
    const suppliers = await this.repository.findAll();

    return {
      suppliers,
    };
  }
}
