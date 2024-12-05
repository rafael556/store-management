import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupplierFacade } from '../supplier.facade';
import { DataSource } from 'typeorm';
import { SupplierEntity } from 'src/core/suppliers/infra/db/typeorm/suppliers.entity';
import { CreateSupplierCommandHandler } from 'src/core/suppliers/application/command/create-supplier/create-supplier.command';
import { CreateSupplierCommand, CreateSupplierResult } from 'src/core/suppliers/application/command/create-supplier/create-supplier.command.dto';
import { SupplierTypeOrmRepository } from 'src/core/suppliers/infra/db/typeorm/suppliers-typeorm.repository';
import UpdateSupplierCommandHandler from 'src/core/suppliers/application/command/update-supplier/update-supplier.command';
import { UpdateSupplierResult } from 'src/core/suppliers/application/command/update-supplier/update-supplier.command.dto';
import DetailSupplierQueryHandler from 'src/core/suppliers/application/query/detail-supplier/detail-supplier.query';
import { ListSuppliersQueryHandler } from 'src/core/suppliers/application/query/list-suppliers/list-suppliers.query';
import { SearchSuppliersUseCase } from 'src/core/suppliers/application/query/search-suppliers/search-suppliers.uc';

describe('SupplierFacade Integration Test', () => {
  let facade: SupplierFacade;
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
      providers: [
        {
          provide: 'SupplierRepository',
          useFactory: (datasource: DataSource) =>
            new SupplierTypeOrmRepository(datasource),
          inject: [DataSource],
        },
        {
          provide: CreateSupplierCommandHandler,
          useFactory: (repo) => new CreateSupplierCommandHandler(repo),
          inject: ['SupplierRepository'],
        },
        {
          provide: UpdateSupplierCommandHandler,
          useFactory: (repo) => new UpdateSupplierCommandHandler(repo),
          inject: ['SupplierRepository'],
        },
        {
          provide: DetailSupplierQueryHandler,
          useFactory: (repo) => new DetailSupplierQueryHandler(repo),
          inject: ['SupplierRepository'],
        },
        {
          provide: ListSuppliersQueryHandler,
          useFactory: (repo) => new ListSuppliersQueryHandler(repo),
          inject: ['SupplierRepository'],
        },
        {
          provide: SearchSuppliersUseCase,
          useFactory: (repo) => new SearchSuppliersUseCase(repo),
          inject: ['SupplierRepository'],
        },
        SupplierFacade,
      ],
    }).compile();

    facade = moduleRef.get(SupplierFacade);
    dataSource = moduleRef.get<DataSource>(DataSource);
  });

  afterEach(async () => {
    await dataSource.destroy();
  });

  it('should create a supplier successfully', async () => {
    // Arrange
    const supplier: CreateSupplierCommand = {
      name: 'Supplier Name',
      telephone: '123456789',
      socialMedia: 'socialMedia',
    };

    // Act
    const newSupplier = await facade.createSupplier(supplier);
    const savedSupplier = await dataSource
      .getRepository(SupplierEntity)
      .findOne({ where: { supplierName: 'Supplier Name' } });

    // Assert
    expect(newSupplier).toBeDefined();
    expect(savedSupplier).toBeDefined();
    expect(savedSupplier.supplierName).toBe(newSupplier.name);
    expect(savedSupplier.supplierTelephone).toBe(newSupplier.telephone);
    expect(savedSupplier.supplierSocialMedia).toBe(newSupplier.socialMedia);
  });

  it('should throw error when saving supplier with existing name', async () => {
    // Arrange
    const supplier: CreateSupplierCommand = {
      name: 'Supplier Name',
      telephone: '123456789',
      socialMedia: 'socialMedia',
    };

    // Act
    await facade.createSupplier(supplier);
    await expect(facade.createSupplier(supplier)).rejects.toThrow();
  });

  it('should update supplier successfully', async () => {
    // Arrange
    const supplier: CreateSupplierCommand = {
      name: 'Supplier Name',
      telephone: '123456789',
      socialMedia: 'socialMedia',
    };

    // Act
    const newSupplier: CreateSupplierResult = await facade.createSupplier(supplier);

    const updateSupplierInput = {
      id: newSupplier.supplierId,
      name: 'New Supplier Name',
      telephone: '987654321',
      socialMedia: 'newSocialMedia',
      isActive: true,
    };

    const updatedSupplier: UpdateSupplierResult = await facade.updateSupplier(updateSupplierInput);

    const savedSupplier = await dataSource
      .getRepository(SupplierEntity)
      .findOne({ where: { supplierId: newSupplier.supplierId } });

    // Assert
    expect(newSupplier).toBeDefined();
    expect(updatedSupplier).toBeDefined();
    expect(savedSupplier).toBeDefined();
    expect(savedSupplier.supplierName).toBe(updatedSupplier.name);
    expect(savedSupplier.supplierTelephone).toBe(updatedSupplier.telephone);
    expect(savedSupplier.supplierSocialMedia).toBe(updatedSupplier.socialMedia);
  });

  it('should throw error when updating supplier with non-existing id', async () => {
    // Arrange
    const updateSupplierInput = {
      id: 'non-existing-id',
      name: 'New Supplier Name',
      telephone: '987654321',
      socialMedia: 'newSocialMedia',
      isActive: true,
    };

    // Act
    await expect(facade.updateSupplier(updateSupplierInput)).rejects.toThrow();
  });

  it('should detail a supplier successfully', async () => {
    // Arrange
    const supplier: CreateSupplierCommand = {
      name: 'Supplier Name',
      telephone: '123456789',
      socialMedia: 'socialMedia',
    };

    // Act
    const newSupplier: CreateSupplierResult = await facade.createSupplier(supplier);

    const detailSupplier = await facade.detailSupplier(newSupplier.supplierId);

    // Assert
    expect(newSupplier).toBeDefined();
    expect(detailSupplier).toBeDefined();
    expect(detailSupplier.supplierId).toBe(newSupplier.supplierId);
    expect(detailSupplier.name).toBe(newSupplier.name);
    expect(detailSupplier.telephone).toBe(newSupplier.telephone);
    expect(detailSupplier.socialMedia).toBe(newSupplier.socialMedia);
  });

  it('should throw error when detailing supplier with non-existing id', async () => {
    // Arrange
    const id = 'non-existing-id';

    // Act
    await expect(facade.detailSupplier(id)).rejects.toThrow();
  });

  it('should list suppliers successfully', async () => {
    // Arrange
    const supplier: CreateSupplierCommand = {
      name: 'Supplier Name',
      telephone: '123456789',
      socialMedia: 'socialMedia',
    };

    // Act
    const newSupplier = await facade.createSupplier(supplier);
    const listSuppliers = await facade.listSuppliers();

    // Assert
    expect(newSupplier).toBeDefined();
    expect(listSuppliers).toBeDefined();
    expect(listSuppliers.suppliers.length).toBe(1);
  });

  it('should search paginated suppliers successfully', async () => {
    // Arrange
    const supplier: CreateSupplierCommand = {
      name: 'Supplier Name',
      telephone: '123456789',
      socialMedia: 'socialMedia',
    };

    // Act
    const newSupplier = await facade.createSupplier(supplier);
    const searchSuppliers = await facade.searchSuppliers({
      page: 1,
      pageSize: 10,
      filter: {
        isActive: true,
      },
      sort: 'supplierName',
      sortDir: 'asc',
    });

    // Assert
    expect(newSupplier).toBeDefined();
    expect(searchSuppliers).toBeDefined();
    expect(searchSuppliers.items.length).toBe(1);
  });
});
