import { ISupplierRepository } from 'src/core/suppliers/domain/supplier.repository.interface';
import { DataSource, Like, Repository, SortDirection } from 'typeorm';
import { SupplierEntity } from './suppliers.entity';
import { Supplier } from 'src/core/suppliers/domain/supplier.aggregate';
import { SupplierMapper } from './suppliers-model.mapper';
import { Logger } from '@nestjs/common';
import {
  SupplierSearchParams,
  SupplierSearchResult,
} from 'src/core/suppliers/domain/supplier.search.type';

export class SupplierTypeOrmRepository implements ISupplierRepository {
  private readonly repository: Repository<SupplierEntity>;
  sortableFields: string[] = [
    'supplierName',
    'supplierCreatedAt',
    'supplierUpdatedAt',
  ];

  constructor(private readonly dataSource: DataSource) {
    this.repository = dataSource.getRepository(SupplierEntity);
  }

  async insert(supplier: Supplier): Promise<void> {
    const supplierEntity = SupplierMapper.toModel(supplier);

    supplierEntity.supplierCreatedAt = new Date();
    supplierEntity.supplierUpdatedAt = new Date();

    try {
      await this.repository.save(supplierEntity);
    } catch (error) {
      Logger.error(
        `Error saving supplier: ${error}`,
        error.stack,
        'SupplierTypeOrmRepository',
      );
      throw new Error('Error saving supplier');
    }
  }

  async update(supplierId: string, supplier: Supplier): Promise<void> {
    const supplierEntity = SupplierMapper.toModel(supplier);
    supplierEntity.supplierUpdatedAt = new Date();

    try {
      await this.repository.update(supplierId, supplierEntity);
    } catch (error) {
      Logger.error(
        `Error updating supplier: ${error}`,
        error.stack,
        'SupplierTypeOrmRepository',
      );
      throw new Error('Error updating supplier');
    }
  }

  async exists(supplierId: string): Promise<boolean> {
    const supplier = await this.repository.exists({ where: { supplierId } });
    return !!supplier;
  }

  async findById(supplierId: string): Promise<Supplier> {
    const supplier = await this.repository.findOne({ where: { supplierId } });
    return SupplierMapper.toDomain(supplier);
  }

  async findAll(): Promise<Supplier[]> {
    const suppliers = await this.repository.find();
    return suppliers.map(SupplierMapper.toDomain);
  }

  async search(params: SupplierSearchParams): Promise<SupplierSearchResult> {
    const { filter, page, per_page, sort, sort_dir } = params;

    const where: Record<string, any> = {};
    if (filter?.name) {
      where.supplierName = Like(`%${filter.name}%`);
    }
    if (filter?.isActive !== undefined) {
      where.supplierIsActive = filter.isActive;
    }

    const order: { [x: string]: SortDirection } = this.sortableFields.includes(
      sort || '',
    )
      ? { [sort]: sort_dir || 'asc' }
      : { supplierCreatedAt: 'desc' };

    const [items, total] = await this.repository.findAndCount({
      where,
      order: order,
      skip: (page - 1) * per_page,
      take: per_page,
    });

    const suppliers = items.map(SupplierMapper.toDomain);

    return new SupplierSearchResult({
      items: suppliers,
      total,
      current_page: page,
      per_page,
    });
  }
}
