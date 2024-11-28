import { Uuid } from 'src/core/shared/domain/value-objects/uuid.vo';
import { Supplier } from 'src/core/suppliers/domain/supplier.aggregate';
import { ISupplierRepository } from 'src/core/suppliers/domain/supplier.repository.interface';
import { ListSuppliersUseCase } from '../list-suppliers.uc';

describe('List suppliers use case unit test', () => {
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

    const repository: ISupplierRepository = {
      insert: jest.fn(),
      update: jest.fn(),
      exists: jest.fn().mockReturnValue(true),
      findById: jest.fn(),
      findAll: jest.fn().mockResolvedValueOnce([supplier1, supplier2]),
      search: jest.fn(),
      sortableFields: [],
    };

    const usecase = new ListSuppliersUseCase(repository);

    // Act
    const suppliers = await usecase.execute();

    // Assert
    expect(suppliers).toBeDefined();
    expect(suppliers.suppliers.length).toBe(2);

    const supplier1FromList = suppliers.suppliers[0];
    const supplier2FromList = suppliers.suppliers[1];

    expect(supplier1FromList.name).toBe('Supplier Name 1');
    expect(supplier1FromList.telephone).toBe('123456789');
    expect(supplier1FromList.socialMedia).toBe('socialMedia');
    expect(supplier1FromList.isActive()).toBe(true);

    expect(supplier2FromList.name).toBe('Supplier Name 2');
    expect(supplier2FromList.telephone).toBe('123456789');
    expect(supplier2FromList.socialMedia).toBe('socialMedia2');
    expect(supplier2FromList.isActive()).toBe(true);
  });

  it('should return empty list when no suppliers found', async () => {
    // Arrange

    const repository: ISupplierRepository = {
      insert: jest.fn(),
      update: jest.fn(),
      exists: jest.fn().mockReturnValue(true),
      findById: jest.fn(),
      findAll: jest.fn().mockResolvedValueOnce([]),
      search: jest.fn(),
      sortableFields: [],
    };

    const usecase = new ListSuppliersUseCase(repository);

    // Act
    const suppliers = await usecase.execute();

    // Assert
    expect(suppliers).toBeDefined();
    expect(suppliers.suppliers.length).toBe(0);
  });
});
