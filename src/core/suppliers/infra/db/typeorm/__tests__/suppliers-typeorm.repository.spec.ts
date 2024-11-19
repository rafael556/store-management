import { DataSource } from 'typeorm';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupplierEntity } from '../suppliers.entity';
import { SupplierTypeOrmRepository } from '../suppliers-typeorm.repository';
import { Supplier } from 'src/core/suppliers/domain/supplier.aggregate';
import { Uuid } from 'src/core/shared/domain/value-objects/uuid.vo';

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
    await repository.saveSupplier(supplier);
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
    await repository.saveSupplier(supplier);

    // Assert
    expect(async () => {
      await repository.saveSupplier(supplier);
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
    await repository.saveSupplier(supplier);
    const savedSupplier = await dataSource
      .getRepository(SupplierEntity)
      .findOne({ where: { supplierName: 'Supplier Name' } });

    supplier.changeName('New Supplier Name');
    await repository.updateSupplier(savedSupplier.supplierId, supplier);

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
    await repository.saveSupplier(supplier);

    await repository.saveSupplier(supplier2);

    supplier2.changeSocialMedia('socialMedia');
    // Assert
    expect(async () => {
      await repository.updateSupplier(supplier2.entityId.id, supplier2);
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
    await repository.saveSupplier(supplier);
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
    await repository.saveSupplier(supplier);
    const exists = await repository.exists('non-existing-id');

    // Assert
    expect(exists).toBe(false);
  });
});
