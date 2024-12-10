import { Injectable } from '@nestjs/common';
import { CommandBus } from 'src/core/shared/application/command.bus';
import { QueryBus } from 'src/core/shared/application/query.bus';
import {
  CreateSupplierCommand,
  CreateSupplierResult,
} from 'src/core/suppliers/application/command/create-supplier/create-supplier.command.dto';
import {
  UpdateSupplierCommand,
  UpdateSupplierResult,
} from 'src/core/suppliers/application/command/update-supplier/update-supplier.command.dto';
import {
  DetailSupplierQuery,
  DetailSupplierResponse,
} from 'src/core/suppliers/application/query/detail-supplier/detail-supplier.query.dto';
import { ListSuppliersResult } from 'src/core/suppliers/application/query/list-suppliers/list-suppliers.query.dto';
import {
  SearchSuppliersQuery,
  SearchSuppliersResult,
} from 'src/core/suppliers/application/query/search-suppliers/search-suppliers.query.dto';

@Injectable()
export class SupplierFacade {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async createSupplier(
    supplier: CreateSupplierCommand,
  ): Promise<CreateSupplierResult> {
    return await this.commandBus.execute<
      CreateSupplierCommand,
      CreateSupplierResult
    >('Create Supplier', supplier);
  }

  async updateSupplier(
    supplier: UpdateSupplierCommand,
  ): Promise<UpdateSupplierResult> {
    return await this.commandBus.execute<
      UpdateSupplierCommand,
      UpdateSupplierResult
    >('Update Supplier', supplier);
  }

  async detailSupplier(supplierId: string) {
    return await this.queryBus.execute<
      DetailSupplierQuery,
      DetailSupplierResponse
    >('Detail Supplier', { supplierId });
  }

  async listSuppliers() {
    return await this.queryBus.execute<any, ListSuppliersResult>(
      'List Suppliers',
      {},
    );
  }

  async searchSuppliers(input: SearchSuppliersQuery) {
    return await this.queryBus.execute<
      SearchSuppliersQuery,
      SearchSuppliersResult
    >('Search Suppliers', input);
  }
}
