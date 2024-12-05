import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Uuid } from 'src/core/shared/domain/value-objects/uuid.vo';
import { Supplier } from 'src/core/suppliers/domain/supplier.aggregate';
import { ISupplierRepository } from 'src/core/suppliers/domain/supplier.repository.interface';
import { SupplierTypeOrmRepository } from 'src/core/suppliers/infra/db/typeorm/suppliers-typeorm.repository';
import { SupplierEntity } from 'src/core/suppliers/infra/db/typeorm/suppliers.entity';
import { DataSource } from 'typeorm';
import { UpdateSupplierResult } from '../update-supplier.command.dto';
import UpdateSupplierCommandHandler from '../update-supplier.command';

describe('Update Supplier integration test', () => {
  let repository: ISupplierRepository;
  let dataSource: DataSource;
  let updateSupplierUseCase: UpdateSupplierCommandHandler;

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
    updateSupplierUseCase = new UpdateSupplierCommandHandler(repository);
  });

  afterEach(async () => {
    dataSource.destroy();
  });

  it('should update supplier', async () => {
    // Arrange
    const newSupplier = new Supplier({
      supplierId: new Uuid(),
      name: 'Supplier Name',
      telephone: '123456789',
      socialMedia: 'socialMedia',
      isActive: true,
    });

    await dataSource.getRepository(SupplierEntity).save({
      supplierId: newSupplier.entityId.id,
      supplierName: newSupplier.name,
      supplierTelephone: newSupplier.telephone,
      supplierSocialMedia: newSupplier.socialMedia,
      supplierIsActive: newSupplier.isActive(),
      supplierCreatedAt: new Date(),
      supplierUpdatedAt: new Date(),
    });

    // Act

    const updateSupplierCommand = {
      id: newSupplier.entityId.id,
      name: 'New Supplier Name',
      telephone: '987654321',
      socialMedia: 'newSocialMedia',
      isActive: false,
    };

    const updatedSupplier: UpdateSupplierResult =
      await updateSupplierUseCase.execute(updateSupplierCommand);

    // Assert
    expect(updatedSupplier).toBeDefined();
    expect(updatedSupplier.name).toBe('New Supplier Name');
    expect(updatedSupplier.telephone).toBe('987654321');
    expect(updatedSupplier.socialMedia).toBe('newSocialMedia');
    expect(updatedSupplier.isActive).toBe(false);
  });

  it('should throw error when supplier not found', async () => {
    // Arrange
    const updateSupplierCommand = {
      id: new Uuid().id,
      name: 'New Supplier Name',
      telephone: '987654321',
      socialMedia: 'newSocialMedia',
      isActive: false,
    };

    // Act
    try {
      await updateSupplierUseCase.execute(updateSupplierCommand);
    } catch (error) {
      // Assert
      expect(error.message).toBe('Supplier not found');
    }
  });
});
