import { DataSource } from 'typeorm';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupplierEntity } from '../suppliers.entity';
import { SupplierTypeOrmRepository } from '../suppliers-typeorm.repository';
import { Supplier } from 'src/core/suppliers/domain/supplier.aggregate';
import { Uuid } from 'src/core/shared/domain/value-objects/uuid.vo';
import { SupplierSearchParams } from 'src/core/suppliers/domain/supplier.search.type';
import { SearchParams } from 'src/core/shared/domain/repository/search-params';

describe('SupplierTypeOrmRepository Integration Test', () => {
  let repository: SupplierTypeOrmRepository;
  let dataSource: DataSource;

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
  });

  afterEach(async () => {
    await dataSource.destroy();
  });

  it('should save and retrieve supplier', async () => {
    // Arrange
    const supplier = new Supplier({
      supplierId: new Uuid(),
      name: 'Supplier Name',
      telephone: '123456789',
      socialMedia: 'socialMedia',
      isActive: true,
    });

    // Act
    await repository.insert(supplier);
    const savedSupplier = await dataSource
      .getRepository(SupplierEntity)
      .findOne({ where: { supplierName: 'Supplier Name' } });

    // Assert
    expect(savedSupplier).toBeDefined();
    expect(savedSupplier.supplierName).toBe('Supplier Name');
  });

  it('should throw error when saving supplier with existing name', async () => {
    // Arrange
    const supplier = new Supplier({
      supplierId: new Uuid(),
      name: 'Supplier Name',
      telephone: '123456789',
      socialMedia: 'socialMedia',
      isActive: true,
    });

    // Act
    await repository.insert(supplier);

    // Assert
    expect(async () => {
      await repository.insert(supplier);
    }).rejects.toThrow(new Error('Error saving supplier'));
  });

  it('should save and retrieve supplier with updated name', async () => {
    // Arrange
    const supplier = new Supplier({
      supplierId: new Uuid(),
      name: 'Supplier Name',
      telephone: '123456789',
      socialMedia: 'socialMedia',
      isActive: true,
    });

    // Act
    await repository.insert(supplier);
    const savedSupplier = await dataSource
      .getRepository(SupplierEntity)
      .findOne({ where: { supplierName: 'Supplier Name' } });

    supplier.changeName('New Supplier Name');
    await repository.update(savedSupplier.supplierId, supplier);

    const updatedSupplier = await dataSource
      .getRepository(SupplierEntity)
      .findOne({ where: { supplierName: 'New Supplier Name' } });

    // Assert
    expect(updatedSupplier).toBeDefined();
    expect(updatedSupplier.supplierName).toBe('New Supplier Name');
  });

  it('should throw error when updating non-existing supplier', async () => {
    // Arrange
    const supplier = new Supplier({
      supplierId: new Uuid(),
      name: 'Supplier Name',
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

    // Act
    await repository.insert(supplier);

    await repository.insert(supplier2);

    supplier2.changeSocialMedia('socialMedia');
    // Assert
    expect(async () => {
      await repository.update(supplier2.entityId.id, supplier2);
    }).rejects.toThrow(new Error('Error updating supplier'));
  });

  it('should return true when supplier exists', async () => {
    // Arrange
    const supplier = new Supplier({
      supplierId: new Uuid(),
      name: 'Supplier Name',
      telephone: '123456789',
      socialMedia: 'socialMedia',
      isActive: true,
    });

    // Act
    await repository.insert(supplier);
    const exists = await repository.exists(supplier.entityId.id);

    // Assert
    expect(exists).toBe(true);
  });

  it('should return false when supplier does not exist', async () => {
    // Arrange
    const supplier = new Supplier({
      supplierId: new Uuid(),
      name: 'Supplier Name',
      telephone: '123456789',
      socialMedia: 'socialMedia',
      isActive: true,
    });

    // Act
    await repository.insert(supplier);
    const exists = await repository.exists('non-existing-id');

    // Assert
    expect(exists).toBe(false);
  });

  it('should return supplier by id', async () => {
    // Arrange
    const supplier = new Supplier({
      supplierId: new Uuid(),
      name: 'Supplier Name',
      telephone: '123456789',
      socialMedia: 'socialMedia',
      isActive: true,
    });

    // Act
    await repository.insert(supplier);
    const savedSupplier = await repository.findById(supplier.entityId.id);

    // Assert
    expect(savedSupplier).toBeDefined();
    expect(savedSupplier.name).toBe('Supplier Name');
    expect(savedSupplier.telephone).toBe('123456789');
    expect(savedSupplier.socialMedia).toBe('socialMedia');
    expect(savedSupplier.isActive()).toBe(true);
  });

  it('should return all suppliers', async () => {
    // Arrange
    const supplier1 = new Supplier({
      supplierId: new Uuid(),
      name: 'Supplier Name 1',
      telephone: '123456789',
      socialMedia: 'socialMedia1',
      isActive: true,
    });

    const supplier2 = new Supplier({
      supplierId: new Uuid(),
      name: 'Supplier Name 2',
      telephone: '123456789',
      socialMedia: 'socialMedia2',
      isActive: true,
    });

    // Act
    await repository.insert(supplier1);
    await repository.insert(supplier2);
    const suppliers = await repository.findAll();

    // Assert
    expect(suppliers).toHaveLength(2);
    expect(suppliers[0].name).toBe('Supplier Name 1');
    expect(suppliers[0].socialMedia).toBe('socialMedia1');
    expect(suppliers[0].isActive()).toBe(true);
    expect(suppliers[0].telephone).toBe('123456789');

    expect(suppliers[1].name).toBe('Supplier Name 2');
    expect(suppliers[1].socialMedia).toBe('socialMedia2');
    expect(suppliers[1].isActive()).toBe(true);
    expect(suppliers[1].telephone).toBe('123456789');
  });

  it('should return suppliers filtered by name', async () => {
    // Arrange
    await repository.insert(
      new Supplier({
        supplierId: new Uuid(),
        name: 'Supplier One',
        telephone: '123456789',
        socialMedia: 'social1',
        isActive: true,
      }),
    );

    await repository.insert(
      new Supplier({
        supplierId: new Uuid(),
        name: 'Another Supplier',
        telephone: '987654321',
        socialMedia: 'social2',
        isActive: true,
      }),
    );

    const params: SupplierSearchParams = new SearchParams({
      filter: { name: 'Supplier' },
      page: 1,
      per_page: 10,
      sort: 'supplierName',
      sort_dir: 'asc',
    });

    // Act
    const result = await repository.search(params);

    // Assert
    expect(result.items).toHaveLength(2);
    expect(result.items[0].name).toBe('Another Supplier');
    expect(result.items[1].name).toBe('Supplier One');
  });

  it('should return suppliers filtered by isActive', async () => {
    // Arrange
    await repository.insert(
      new Supplier({
        supplierId: new Uuid(),
        name: 'Active Supplier',
        telephone: '123456789',
        socialMedia: 'social1',
        isActive: true,
      }),
    );

    await repository.insert(
      new Supplier({
        supplierId: new Uuid(),
        name: 'Inactive Supplier',
        telephone: '987654321',
        socialMedia: 'social2',
        isActive: false,
      }),
    );

    const params: SupplierSearchParams = new SearchParams({
      filter: { isActive: true },
      page: 1,
      per_page: 10,
      sort: 'supplierName',
      sort_dir: 'asc',
    });

    // Act
    const result = await repository.search(params);

    // Assert
    expect(result.items).toHaveLength(1);
    expect(result.items[0].name).toBe('Active Supplier');
  });

  it('should return suppliers sorted with default value', async () => {
    // Arrange
    await repository.insert(
      new Supplier({
        supplierId: new Uuid(),
        name: 'Active Supplier',
        telephone: '123456789',
        socialMedia: 'social1',
        isActive: true,
      }),
    );

    await repository.insert(
      new Supplier({
        supplierId: new Uuid(),
        name: 'Inactive Supplier',
        telephone: '987654321',
        socialMedia: 'social2',
        isActive: false,
      }),
    );

    const params: SupplierSearchParams = new SearchParams({
      page: 1,
      per_page: 10,
      sort: 'test',
      sort_dir: 'asc',
    });

    // Act
    const result = await repository.search(params);

    // Assert
    expect(result.items).toHaveLength(2);
    expect(result.items[0].name).toBe('Inactive Supplier');
  });

  it('should return paginated results', async () => {
    // Arrange
    for (let i = 1; i <= 9; i++) {
      await repository.insert(
        new Supplier({
          supplierId: new Uuid(),
          name: `Supplier ${i}`,
          telephone: `12345${i}`,
          socialMedia: `social${i}`,
          isActive: true,
        }),
      );
    }

    const params: SupplierSearchParams = new SearchParams({
      filter: {},
      page: 2,
      per_page: 3,
      sort: 'supplierName',
      sort_dir: 'asc',
    });

    // Act
    const result = await repository.search(params);

    // Assert
    expect(result.items).toHaveLength(3);
    expect(result.current_page).toBe(2);
    expect(result.items[0].name).toBe('Supplier 4');
    expect(result.items[2].name).toBe('Supplier 6');
  });

  it('should return sorted results', async () => {
    // Arrange
    await repository.insert(
      new Supplier({
        supplierId: new Uuid(),
        name: 'B Supplier',
        telephone: '123456789',
        socialMedia: 'social1',
        isActive: true,
      }),
    );

    await repository.insert(
      new Supplier({
        supplierId: new Uuid(),
        name: 'A Supplier',
        telephone: '987654321',
        socialMedia: 'social2',
        isActive: true,
      }),
    );

    const params: SupplierSearchParams = new SearchParams({
      filter: {},
      page: 1,
      per_page: 10,
      sort: 'supplierName',
      sort_dir: 'desc',
    });

    // Act
    const result = await repository.search(params);

    // Assert
    expect(result.items).toHaveLength(2);
    expect(result.items[0].name).toBe('B Supplier');
    expect(result.items[1].name).toBe('A Supplier');
  });
});
