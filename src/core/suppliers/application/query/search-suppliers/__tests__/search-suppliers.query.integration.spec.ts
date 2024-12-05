import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Uuid } from 'src/core/shared/domain/value-objects/uuid.vo';
import { Supplier } from 'src/core/suppliers/domain/supplier.aggregate';
import { SupplierTypeOrmRepository } from 'src/core/suppliers/infra/db/typeorm/suppliers-typeorm.repository';
import { SupplierEntity } from 'src/core/suppliers/infra/db/typeorm/suppliers.entity';
import { DataSource } from 'typeorm';
import {
  SearchSuppliersQuery,
  SearchSuppliersResult,
} from '../search-suppliers.query.dto';
import { SearchSuppliersQueryHandler } from '../search-suppliers.query';

describe('search suppliers use case integration tests', () => {
  let repository: SupplierTypeOrmRepository;
  let dataSource: DataSource;
  let useCase: SearchSuppliersQueryHandler;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [SupplierEntity],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([SupplierEntity]),
      ],
    }).compile();

    dataSource = moduleRef.get<DataSource>(DataSource);
    repository = new SupplierTypeOrmRepository(dataSource);
    useCase = new SearchSuppliersQueryHandler(repository);
  });

  afterEach(async () => {
    await dataSource.destroy();
  });

  it('should return list of filtered suppliers', async () => {
    // Arrange
    const supplier1 = new Supplier({
      supplierId: new Uuid(),
      name: 'Supplier Name 1',
      telephone: '123456789',
      socialMedia: 'socialMedia',
      isActive: true,
    });

    const supplier2 = new Supplier({
      supplierId: new Uuid(),
      name: 'Supplier Name 2',
      telephone: '123456789',
      socialMedia: 'socialMedia2',
      isActive: true,
    });

    await repository.insert(supplier1);
    await repository.insert(supplier2);

    // Act
    const supplierSearchInput: SearchSuppliersQuery = {
      page: 1,
      pageSize: 10,
      filter: {
        isActive: true,
      },
      sort: 'supplierName',
    };

    const suppliers: SearchSuppliersResult =
      await useCase.execute(supplierSearchInput);

    // Assert
    expect(suppliers).toBeDefined();
    expect(suppliers.total).toBe(2);
    expect(suppliers.currentPage).toBe(1);
    expect(suppliers.perPage).toBe(10);
    expect(suppliers.items[0].name).toBe('Supplier Name 1');
    expect(suppliers.items[1].name).toBe('Supplier Name 2');
  });

  it('should return list of sorted suppliers with pagination', async () => {
    // Arrange
    const supplier1 = new Supplier({
      supplierId: new Uuid(),
      name: 'Supplier Name 1',
      telephone: '123456789',
      socialMedia: 'socialMedia',
      isActive: true,
    });

    const supplier2 = new Supplier({
      supplierId: new Uuid(),
      name: 'Supplier Name 2',
      telephone: '123456789',
      socialMedia: 'socialMedia2',
      isActive: true,
    });

    await repository.insert(supplier1);
    await repository.insert(supplier2);

    // Act
    const supplierSearchInput: SearchSuppliersQuery = {
      page: 1,
      pageSize: 10,
      filter: {
        isActive: true,
      },
      sort: 'supplierName',
      sortDir: 'desc',
    };

    const suppliers: SearchSuppliersResult =
      await useCase.execute(supplierSearchInput);

    // Assert
    expect(suppliers).toBeDefined();
    expect(suppliers.total).toBe(2);
    expect(suppliers.currentPage).toBe(1);
    expect(suppliers.perPage).toBe(10);
    expect(suppliers.items[0].name).toBe('Supplier Name 2');
    expect(suppliers.items[1].name).toBe('Supplier Name 1');
  });

  it('should return an empty list when no suppliers are found', async () => {
    // Arrange
    // Act
    const supplierSearchInput: SearchSuppliersQuery = {
      page: 1,
      pageSize: 10,
      filter: {
        isActive: true,
      },
    };

    const suppliers: SearchSuppliersResult =
      await useCase.execute(supplierSearchInput);

    // Assert
    expect(suppliers).toBeDefined();
    expect(suppliers.total).toBe(0);
    expect(suppliers.currentPage).toBe(1);
    expect(suppliers.perPage).toBe(10);
    expect(suppliers.items).toHaveLength(0);
  });
});
