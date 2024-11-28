import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Uuid } from 'src/core/shared/domain/value-objects/uuid.vo';
import { Supplier } from 'src/core/suppliers/domain/supplier.aggregate';
import { SupplierTypeOrmRepository } from 'src/core/suppliers/infra/db/typeorm/suppliers-typeorm.repository';
import { SupplierEntity } from 'src/core/suppliers/infra/db/typeorm/suppliers.entity';
import { DataSource } from 'typeorm';
import { ListSuppliersUseCase } from '../list-suppliers.uc';

describe('List suppliers use case integration test', () => {
  let repository: SupplierTypeOrmRepository;
  let dataSource: DataSource;
  let useCase: ListSuppliersUseCase;

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
    useCase = new ListSuppliersUseCase(repository);
  });

  afterEach(async () => {
    await dataSource.destroy();
  });

  it('should return list of suppliers', async () => {
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
    const suppliers = await useCase.execute();

    // Assert
    expect(suppliers).toBeDefined();
    expect(suppliers.suppliers.length).toBe(2);
    expect(suppliers.suppliers[0].name).toBe('Supplier Name 1');
    expect(suppliers.suppliers[1].name).toBe('Supplier Name 2');
  });

  it('should return empty list of suppliers', async () => {
    // Act
    const suppliers = await useCase.execute();

    // Assert
    expect(suppliers).toBeDefined();
    expect(suppliers.suppliers.length).toBe(0);
  });
});
