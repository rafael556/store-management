import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupplierTypeOrmRepository } from 'src/core/suppliers/infra/db/typeorm/suppliers-typeorm.repository';
import { SupplierEntity } from 'src/core/suppliers/infra/db/typeorm/suppliers.entity';
import { DataSource } from 'typeorm';
import { CreateSupplierCommandHandler } from '../create-supplier.command';
import {
  CreateSupplierCommand,
  CreateSupplierResult,
} from '../create-supplier.command.dto';
import { ISupplierRepository } from 'src/core/suppliers/domain/supplier.repository.interface';

describe('CreateSupplier Integration Test', () => {
  let repository: ISupplierRepository;
  let dataSource: DataSource;
  let createSupplierUseCase: CreateSupplierCommandHandler;

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
    createSupplierUseCase = new CreateSupplierCommandHandler(repository);
  });

  afterEach(async () => {
    await dataSource.destroy();
    createSupplierUseCase.uncommittedEvents = [];
  });

  it('should save and retrieve supplier', async () => {
    // Arrange
    const supplier: CreateSupplierCommand = {
      name: 'Supplier Name',
      telephone: '123456789',
      socialMedia: 'socialMedia',
    };

    // Act
    const newSupplier: CreateSupplierResult =
      await createSupplierUseCase.execute(supplier);
    const savedSupplier = await dataSource
      .getRepository(SupplierEntity)
      .findOne({ where: { supplierName: 'Supplier Name' } });

    // Assert
    expect(newSupplier).toBeDefined();
    expect(savedSupplier).toBeDefined();
    expect(savedSupplier.supplierName).toBe(newSupplier.name);
    expect(savedSupplier.supplierTelephone).toBe(newSupplier.telephone);
    expect(savedSupplier.supplierSocialMedia).toBe(newSupplier.socialMedia);
    expect(savedSupplier.supplierIsActive).toBe(true);
    expect(createSupplierUseCase.getUncommittedEvents()).toHaveLength(1);
  });

  it('should throw error when saving supplier with existing name', async () => {
    // Arrange
    const supplier: CreateSupplierCommand = {
      name: 'Supplier Name',
      telephone: '123456789',
      socialMedia: 'socialMedia',
    };

    // Act
    await createSupplierUseCase.execute(supplier);

    // Assert
    await expect(createSupplierUseCase.execute(supplier)).rejects.toThrow(
      'Error saving supplier',
    );
  });
});
