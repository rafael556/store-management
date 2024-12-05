import { Injectable } from '@nestjs/common';
import { CreateSupplierCommandHandler } from 'src/core/suppliers/application/command/create-supplier/create-supplier.command';
import { CreateSupplierCommand } from 'src/core/suppliers/application/command/create-supplier/create-supplier.command.dto';
import UpdateSupplierCommandHandler from 'src/core/suppliers/application/command/update-supplier/update-supplier.command';
import { UpdateSupplierCommand } from 'src/core/suppliers/application/command/update-supplier/update-supplier.command.dto';
import DetailSupplierQueryHandler from 'src/core/suppliers/application/query/detail-supplier/detail-supplier.query';
import { ListSuppliersQueryHandler } from 'src/core/suppliers/application/query/list-suppliers/list-suppliers.query';
import { SearchSuppliersUseCase } from 'src/core/suppliers/application/query/search-suppliers/search-suppliers.uc';
import { SearchSuppliersPageQuery } from 'src/core/suppliers/application/query/search-suppliers/search-suppliers.uc.dto';

@Injectable()
export class SupplierFacade {
  constructor(
    private readonly createSupplierUseCase: CreateSupplierCommandHandler,
    private readonly updateSupplierUseCase: UpdateSupplierCommandHandler,
    private readonly detailSupplierUseCase: DetailSupplierQueryHandler,
    private readonly listSuppliersUseCase: ListSuppliersQueryHandler,
    private readonly searchSuppliersUseCase: SearchSuppliersUseCase
  ) {}

  async createSupplier(supplier: CreateSupplierCommand) {
    return this.createSupplierUseCase.execute(supplier);
  }

  async updateSupplier(supplier: UpdateSupplierCommand) {
    return this.updateSupplierUseCase.execute(supplier);
  }

  async detailSupplier(supplierId: string) {
    return this.detailSupplierUseCase.execute({ supplierId });
  }

  async listSuppliers() {
    return this.listSuppliersUseCase.execute();
  }

  async searchSuppliers(input: SearchSuppliersPageQuery) {
    return this.searchSuppliersUseCase.execute(input);
  }
}
