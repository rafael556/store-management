import { Injectable } from '@nestjs/common';
import { CommandBus } from 'src/core/shared/application/command.bus';
import { QueryBus } from 'src/core/shared/application/query.bus';
import { CreateSupplierCommandHandler } from 'src/core/suppliers/application/command/create-supplier/create-supplier.command';
import { CreateSupplierCommand, CreateSupplierResult } from 'src/core/suppliers/application/command/create-supplier/create-supplier.command.dto';
import UpdateSupplierCommandHandler from 'src/core/suppliers/application/command/update-supplier/update-supplier.command';
import { UpdateSupplierCommand, UpdateSupplierResult } from 'src/core/suppliers/application/command/update-supplier/update-supplier.command.dto';
import DetailSupplierQueryHandler from 'src/core/suppliers/application/query/detail-supplier/detail-supplier.query';
import { DetailSupplierQuery, DetailSupplierResponse } from 'src/core/suppliers/application/query/detail-supplier/detail-supplier.query.dto';
import { ListSuppliersQueryHandler } from 'src/core/suppliers/application/query/list-suppliers/list-suppliers.query';
import { ListSuppliersResult } from 'src/core/suppliers/application/query/list-suppliers/list-suppliers.query.dto';
import { SearchSuppliersQueryHandler } from 'src/core/suppliers/application/query/search-suppliers/search-suppliers.query';
import { SearchSuppliersQuery, SearchSuppliersResult } from 'src/core/suppliers/application/query/search-suppliers/search-suppliers.query.dto';

@Injectable()
export class SupplierFacade {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly createSupplierCommandHandler: CreateSupplierCommandHandler,
    private readonly updateSupplierCommandHandler: UpdateSupplierCommandHandler,
    private readonly detailSupplierQueryHandler: DetailSupplierQueryHandler,
    private readonly listSuppliersQueryHandler: ListSuppliersQueryHandler,
    private readonly searchSuppliersQueryHandler: SearchSuppliersQueryHandler
  ) {
    this.commandBus.register('CreateSupplierCommandHandler', this.createSupplierCommandHandler);
    this.commandBus.register('UpdateSupplierCommandHandler', this.updateSupplierCommandHandler);

    this.queryBus.register('DetailSupplierQueryHandler', this.detailSupplierQueryHandler);
    this.queryBus.register('ListSuppliersQueryHandler', this.listSuppliersQueryHandler);
    this.queryBus.register('SearchSuppliersQueryHandler', this.searchSuppliersQueryHandler);
  }

  async createSupplier(supplier: CreateSupplierCommand): Promise<CreateSupplierResult> {
    return await this.commandBus.execute<CreateSupplierCommand, CreateSupplierResult>('CreateSupplierCommandHandler', supplier);
  }

  async updateSupplier(supplier: UpdateSupplierCommand): Promise<UpdateSupplierResult> {
    return await this.commandBus.execute<UpdateSupplierCommand, UpdateSupplierResult>('UpdateSupplierCommandHandler', supplier);
  }

  async detailSupplier(supplierId: string) {
    return await this.queryBus.execute<DetailSupplierQuery, DetailSupplierResponse>('DetailSupplierQueryHandler', { supplierId });
  }

  async listSuppliers() {
    return await this.queryBus.execute<any, ListSuppliersResult>('ListSuppliersQueryHandler', {});
  }

  async searchSuppliers(input: SearchSuppliersQuery) {
    return await this.queryBus.execute<SearchSuppliersQuery, SearchSuppliersResult>('SearchSuppliersQueryHandler', input);
  }
}
