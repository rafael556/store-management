import { CommandBus } from 'src/core/shared/application/command.bus';
import { EventBus } from 'src/core/shared/application/event.bus';
import { QueryBus } from 'src/core/shared/application/query.bus';
import { CreateSupplierCommandHandler } from 'src/core/suppliers/application/command/create-supplier/create-supplier.command';
import UpdateSupplierCommandHandler from 'src/core/suppliers/application/command/update-supplier/update-supplier.command';
import DetailSupplierQueryHandler from 'src/core/suppliers/application/query/detail-supplier/detail-supplier.query';
import { ListSuppliersQueryHandler } from 'src/core/suppliers/application/query/list-suppliers/list-suppliers.query';
import { SearchSuppliersQueryHandler } from 'src/core/suppliers/application/query/search-suppliers/search-suppliers.query';
import { ISupplierRepository } from 'src/core/suppliers/domain/supplier.repository.interface';
import { SupplierTypeOrmRepository } from 'src/core/suppliers/infra/db/typeorm/suppliers-typeorm.repository';
import { DataSource } from 'typeorm';

export const REPOSITORIES = {
  SUPPLIER_REPOSITORY: {
    provide: 'SupplierRepository',
    useExisting: SupplierTypeOrmRepository,
  },
  SUPPLIER_TYPEORM_REPOSITORY: {
    provide: SupplierTypeOrmRepository,
    useFactory: (datasource: DataSource) => {
      return new SupplierTypeOrmRepository(datasource);
    },
    inject: [DataSource],
  },
};

export const COMMAND_HANDLERS = {
  CREATE_SUPPLIER_COMMAND_HANDLER: {
    provide: CreateSupplierCommandHandler,
    useFactory: (supplierRepository: ISupplierRepository) => {
      return new CreateSupplierCommandHandler(supplierRepository);
    },
    inject: ['SupplierRepository'],
  },
  UPDATE_SUPPLIER_COMMAND_HANDLER: {
    provide: UpdateSupplierCommandHandler,
    useFactory: (supplierRepository: ISupplierRepository) => {
      return new UpdateSupplierCommandHandler(supplierRepository);
    },
    inject: ['SupplierRepository'],
  },
};

export const QUERY_HANDLERS = {
  DETAIL_SUPPLIER_QUERY_HANDLER: {
    provide: DetailSupplierQueryHandler,
    useFactory: (supplierRepository: ISupplierRepository) => {
      return new DetailSupplierQueryHandler(supplierRepository);
    },
    inject: ['SupplierRepository'],
  },
  LIST_SUPPLIERS_QUERY_HANDLER: {
    provide: ListSuppliersQueryHandler,
    useFactory: (supplierRepository: ISupplierRepository) => {
      return new ListSuppliersQueryHandler(supplierRepository);
    },
    inject: ['SupplierRepository'],
  },
  SEARCH_SUPPLIERS_QUERY_HANDLER: {
    provide: SearchSuppliersQueryHandler,
    useFactory: (supplierRepository: ISupplierRepository) => {
      return new SearchSuppliersQueryHandler(supplierRepository);
    },
    inject: ['SupplierRepository'],
  },
};

export const EVENT_HANDLERS = {};

export const BUS = {
  SUPPLIER_COMMAND_BUS: {
    provide: 'SupplierCommandBus',
    useFactory: (commandHandlers, SupplierEventBus) => {
      const commandBus = new CommandBus(SupplierEventBus);
      commandBus.register(
        'Create Supplier',
        commandHandlers.CREATE_SUPPLIER_COMMAND_HANDLER,
      );
      commandBus.register(
        'Update Supplier',
        commandHandlers.UPDATE_SUPPLIER_COMMAND_HANDLER,
      );
      return commandBus;
    },
    inject: [COMMAND_HANDLERS, EventBus],
  },
  SUPPLIER_QUERY_BUS: {
    provide: 'SupplierQueryBus',
    useFactory: (queryHandlers) => {
      const queryBus = new QueryBus();
      queryBus.register(
        'Detail Supplier',
        queryHandlers.DETAIL_SUPPLIER_QUERY_HANDLER,
      );
      queryBus.register(
        'List Suppliers',
        queryHandlers.LIST_SUPPLIERS_QUERY_HANDLER,
      );
      queryBus.register(
        'Search Suppliers',
        queryHandlers.SEARCH_SUPPLIERS_QUERY_HANDLER,
      );
      return queryBus;
    },
    inject: [QUERY_HANDLERS],
  },
  SUPPLIER_EVENT_BUS: {
    provide: 'SupplierEventBus',
    useFactory: (eventHandlers) => {
      const eventBus = new EventBus();
      return eventBus;
    },
    inject: [EVENT_HANDLERS],
  },
};

export const SUPPLIERS_PROVIDERS = [
  REPOSITORIES,
  COMMAND_HANDLERS,
  QUERY_HANDLERS,
  EVENT_HANDLERS,
  BUS,
];
