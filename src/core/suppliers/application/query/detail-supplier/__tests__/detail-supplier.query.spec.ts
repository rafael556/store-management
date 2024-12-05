import { Uuid } from 'src/core/shared/domain/value-objects/uuid.vo';
import { Supplier } from 'src/core/suppliers/domain/supplier.aggregate';
import { ISupplierRepository } from 'src/core/suppliers/domain/supplier.repository.interface';
import DetailSupplierQueryHandler from '../detail-supplier.query';

describe('detail supplier use case unit test', () => {
  it('should return supplier by id', async () => {
    // Arrange

    const supplier = new Supplier({
      supplierId: new Uuid(),
      name: 'Supplier Name',
      telephone: '123456789',
      socialMedia: 'socialMedia',
      isActive: true,
    });

    const repository: ISupplierRepository = {
      insert: jest.fn(),
      update: jest.fn(),
      exists: jest.fn().mockReturnValue(true),
      findById: jest.fn().mockResolvedValueOnce(supplier),
      findAll: jest.fn(),
      search: jest.fn(),
      sortableFields: [],
    };

    const usecase = new DetailSupplierQueryHandler(repository);

    // Act
    await repository.insert(supplier);
    const savedSupplier = await usecase.execute({
      supplierId: supplier.entityId.id,
    });

    // Assert
    expect(savedSupplier).toBeDefined();
    expect(savedSupplier.name).toBe('Supplier Name');
    expect(savedSupplier.telephone).toBe('123456789');
    expect(savedSupplier.socialMedia).toBe('socialMedia');
    expect(savedSupplier.isActive).toBe(true);
  });

  it('should throw error when supplier not found', async () => {
    // Arrange
    const supplierId = new Uuid();

    const repository: ISupplierRepository = {
      insert: jest.fn(),
      update: jest.fn(),
      exists: jest.fn().mockResolvedValueOnce(false),
      findById: jest.fn().mockReturnValue(null),
      findAll: jest.fn(),
      search: jest.fn(),
      sortableFields: [],
    };

    const usecase = new DetailSupplierQueryHandler(repository);

    // Act
    try {
      await usecase.execute({ supplierId: supplierId.id });
    } catch (error) {
      // Assert
      expect(error).toBeDefined();
      expect(error.message).toBe('Supplier not found');
    }
  });
});
