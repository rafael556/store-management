import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Uuid } from 'src/core/shared/domain/value-objects/uuid.vo';
import { Supplier } from 'src/core/suppliers/domain/supplier.aggregate';
import { SupplierTypeOrmRepository } from 'src/core/suppliers/infra/db/typeorm/suppliers-typeorm.repository';
import { SupplierEntity } from 'src/core/suppliers/infra/db/typeorm/suppliers.entity';
import { DataSource } from 'typeorm';
import DetailSupplierUseCase from '../detail-supplier.uc';

describe('Detail supplier use case integration test', () => {
  let repository: SupplierTypeOrmRepository;
  let dataSource: DataSource;
  let useCase: DetailSupplierUseCase;

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
    useCase = new DetailSupplierUseCase(repository);
  });

  afterEach(async () => {
    await dataSource.destroy();
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

    await repository.insert(supplier);

    // Act
    const supplierFound = await useCase.execute({
      supplierId: supplier.entityId.id,
    });

    // Assert
    expect(supplierFound).toBeDefined();
    expect(supplierFound.name).toBe('Supplier Name');
    expect(supplierFound.telephone).toBe('123456789');
    expect(supplierFound.socialMedia).toBe('socialMedia');
    expect(supplierFound.isActive).toBe(true);
  });

  it('should throw error when supplier not found', async () => {
    // Arrange
    const supplierId = new Uuid();

    // Act
    const supplierFound = useCase.execute({ supplierId: supplierId.id });

    // Assert
    await expect(supplierFound).rejects.toThrow('Supplier not found');
  });
});
