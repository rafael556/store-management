import { Uuid } from 'src/core/shared/domain/value-objects/uuid.vo';
import { Supplier } from 'src/core/suppliers/domain/supplier.aggregate';
import { ISupplierRepository } from 'src/core/suppliers/domain/supplier.repository.interface';
import {
  SearchSuppliersPageQuery,
  SearchSuppliersPageResult,
} from '../search-suppliers.uc.dto';
import { SearchSuppliersUseCase } from '../search-suppliers.uc';

describe('search suppliers use case unit test', () => {
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

    const repository: ISupplierRepository = {
      insert: jest.fn(),
      update: jest.fn(),
      exists: jest.fn().mockReturnValue(true),
      findById: jest.fn(),
      findAll: jest.fn().mockResolvedValueOnce([supplier1, supplier2]),
      search: jest.fn().mockResolvedValueOnce({
        items: [supplier1, supplier2],
        current_page: 1,
        per_page: 10,
        total: 2,
      }),
      sortableFields: ['supplierName'],
    };

    const usecase = new SearchSuppliersUseCase(repository);

    // Act
    const supplierSearchInput: SearchSuppliersPageQuery = {
      page: 1,
      pageSize: 10,
      filter: {
        isActive: true,
      },
    };

    const suppliers: SearchSuppliersPageResult =
      await usecase.execute(supplierSearchInput);

    // Assert
    expect(suppliers).toBeDefined();
    expect(suppliers.items.length).toBe(2);

    const supplier1FromList = suppliers.items[0];

    expect(suppliers.total).toBe(2);
    expect(suppliers.currentPage).toBe(1);
    expect(suppliers.perPage).toBe(10);
    expect(supplier1FromList.name).toBe('Supplier Name 1');
    expect(supplier1FromList.telephone).toBe('123456789');
    expect(supplier1FromList.socialMedia).toBe('socialMedia');
    expect(supplier1FromList.isActive()).toBe(true);
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

    const repository: ISupplierRepository = {
      insert: jest.fn(),
      update: jest.fn(),
      exists: jest.fn().mockReturnValue(true),
      findById: jest.fn(),
      findAll: jest.fn().mockResolvedValueOnce([supplier1, supplier2]),
      search: jest.fn().mockResolvedValueOnce({
        items: [supplier2, supplier1],
        current_page: 1,
        per_page: 10,
        total: 2,
      }),
      sortableFields: ['supplierName'],
    };

    const usecase = new SearchSuppliersUseCase(repository);

    // Act
    const supplierSearchInput: SearchSuppliersPageQuery = {
      page: 1,
      pageSize: 10,
      filter: {
        isActive: true,
      },
      sort: 'supplierName',
      sortDir: 'desc',
    };

    const suppliers: SearchSuppliersPageResult =
      await usecase.execute(supplierSearchInput);

    // Assert
    expect(suppliers).toBeDefined();
    expect(suppliers.items.length).toBe(2);

    const supplier2FromList = suppliers.items[0];

    expect(suppliers.total).toBe(2);
    expect(suppliers.currentPage).toBe(1);
    expect(suppliers.perPage).toBe(10);
    expect(supplier2FromList.name).toBe('Supplier Name 2');
    expect(supplier2FromList.telephone).toBe('123456789');
    expect(supplier2FromList.socialMedia).toBe('socialMedia2');
    expect(supplier2FromList.isActive()).toBe(true);
  });

  it('should return empty list of suppliers', async () => {
    // Arrange
    const repository: ISupplierRepository = {
      insert: jest.fn(),
      update: jest.fn(),
      exists: jest.fn().mockReturnValue(true),
      findById: jest.fn(),
      findAll: jest.fn().mockResolvedValueOnce([]),
      search: jest.fn().mockResolvedValueOnce({
        items: [],
        current_page: 1,
        per_page: 10,
        total: 0,
      }),
      sortableFields: ['supplierName'],
    };

    const usecase = new SearchSuppliersUseCase(repository);

    // Act
    const supplierSearchInput: SearchSuppliersPageQuery = {
      page: 1,
      pageSize: 10,
      filter: {
        isActive: true,
      },
    };

    const suppliers: SearchSuppliersPageResult =
      await usecase.execute(supplierSearchInput);

    // Assert
    expect(suppliers).toBeDefined();
    expect(suppliers.items.length).toBe(0);
    expect(suppliers.total).toBe(0);
    expect(suppliers.currentPage).toBe(1);
    expect(suppliers.perPage).toBe(10);
  });
});
