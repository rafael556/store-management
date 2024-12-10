import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupplierFacade } from '../supplier.facade';
import { DataSource } from 'typeorm';
import { SupplierEntity } from 'src/core/suppliers/infra/db/typeorm/suppliers.entity';
import { CreateSupplierCommandHandler } from 'src/core/suppliers/application/command/create-supplier/create-supplier.command';
import {
  CreateSupplierCommand,
  CreateSupplierResult,
} from 'src/core/suppliers/application/command/create-supplier/create-supplier.command.dto';
import { SupplierTypeOrmRepository } from 'src/core/suppliers/infra/db/typeorm/suppliers-typeorm.repository';
import UpdateSupplierCommandHandler from 'src/core/suppliers/application/command/update-supplier/update-supplier.command';
import { UpdateSupplierResult } from 'src/core/suppliers/application/command/update-supplier/update-supplier.command.dto';
import DetailSupplierQueryHandler from 'src/core/suppliers/application/query/detail-supplier/detail-supplier.query';
import { ListSuppliersQueryHandler } from 'src/core/suppliers/application/query/list-suppliers/list-suppliers.query';
import { SearchSuppliersQueryHandler } from 'src/core/suppliers/application/query/search-suppliers/search-suppliers.query';
import { CommandBus } from 'src/core/shared/application/command.bus';
import { QueryBus } from 'src/core/shared/application/query.bus';
import { EventBus } from 'src/core/shared/application/event.bus';

describe('SupplierFacade Integration Test', () => {
  let facade: SupplierFacade;
  let dataSource: DataSource;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite', // Banco em memória para testes
          database: ':memory:',
          entities: [SupplierEntity], // Registra a entidade de fornecedores
          synchronize: true, // Gera o esquema automaticamente no banco em memória
        }),
        TypeOrmModule.forFeature([SupplierEntity]), // Disponibiliza a entidade como repositório TypeORM
      ],
      providers: [
        // Registro do repositório
        {
          provide: 'SupplierRepository',
          useFactory: (datasource: DataSource) =>
            new SupplierTypeOrmRepository(datasource),
          inject: [DataSource], // Injeta o DataSource no repositório
        },
        // Handlers de comandos
        {
          provide: CreateSupplierCommandHandler,
          useFactory: (repo) => new CreateSupplierCommandHandler(repo),
          inject: ['SupplierRepository'], // Injeta o repositório no handler
        },
        {
          provide: UpdateSupplierCommandHandler,
          useFactory: (repo) => new UpdateSupplierCommandHandler(repo),
          inject: ['SupplierRepository'],
        },
        // Handlers de queries
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
          provide: SearchSuppliersQueryHandler,
          useFactory: (repo) => new SearchSuppliersQueryHandler(repo),
          inject: ['SupplierRepository'],
        },
        // Bus de Comandos
        {
          provide: CommandBus,
          useFactory: (
            createHandler: CreateSupplierCommandHandler,
            updateHandler: UpdateSupplierCommandHandler,
            eventBus: EventBus,
          ) => {
            const commandBus = new CommandBus(eventBus);
            commandBus.register('Create Supplier', createHandler); // Registra handler para criar
            commandBus.register('Update Supplier', updateHandler); // Registra handler para atualizar
            return commandBus;
          },
          inject: [
            CreateSupplierCommandHandler,
            UpdateSupplierCommandHandler,
            EventBus,
          ], // Injeta handlers e o EventBus
        },
        // Bus de Queries
        {
          provide: QueryBus,
          useFactory: (
            detailHandler: DetailSupplierQueryHandler,
            listHandler: ListSuppliersQueryHandler,
            searchHandler: SearchSuppliersQueryHandler,
          ) => {
            const queryBus = new QueryBus();
            queryBus.register('Detail Supplier', detailHandler); // Detalhes
            queryBus.register('List Suppliers', listHandler); // Lista
            queryBus.register('Search Suppliers', searchHandler); // Busca
            return queryBus;
          },
          inject: [
            DetailSupplierQueryHandler,
            ListSuppliersQueryHandler,
            SearchSuppliersQueryHandler,
          ], // Injeta handlers de queries
        },
        // Event Bus (Simples para o exemplo)
        {
          provide: EventBus,
          useFactory: () => new EventBus(),
        },
        SupplierFacade,
      ],
    }).compile();

    // Obtém os serviços criados para uso nos testes
    facade = moduleRef.get(SupplierFacade); // Obtém a fachada principal
    dataSource = moduleRef.get<DataSource>(DataSource); // Obtém a conexão do TypeORM
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
    const newSupplier: CreateSupplierResult =
      await facade.createSupplier(supplier);

    const updateSupplierInput = {
      id: newSupplier.supplierId,
      name: 'New Supplier Name',
      telephone: '987654321',
      socialMedia: 'newSocialMedia',
      isActive: true,
    };

    const updatedSupplier: UpdateSupplierResult =
      await facade.updateSupplier(updateSupplierInput);

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
    const newSupplier: CreateSupplierResult =
      await facade.createSupplier(supplier);

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
