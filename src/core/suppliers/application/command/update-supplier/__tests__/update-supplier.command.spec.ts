import { Uuid } from 'src/core/shared/domain/value-objects/uuid.vo';
import {
  UpdateSupplierCommand,
  UpdateSupplierResult,
} from '../update-supplier.command.dto';
import { Supplier } from 'src/core/suppliers/domain/supplier.aggregate';
import UpdateSupplierCommandHandler from '../update-supplier.command';

describe('Update supplier unit test', () => {
  it('should update supplier', async () => {
    // Arrange
    const supplierRepository = {
      insert: jest.fn(),
      update: jest.fn(),
      exists: jest.fn().mockReturnValue(true),
      findById: jest.fn(),
      findAll: jest.fn(),
      search: jest.fn(),
      sortableFields: [],
    };

    const newSupplier = new Supplier({
      supplierId: new Uuid(),
      name: 'Supplier Name',
      telephone: '123456789',
      socialMedia: 'socialMedia',
      isActive: true,
    });

    const updateSupplierUseCase = new UpdateSupplierCommandHandler(
      supplierRepository,
    );
    const supplierInput: UpdateSupplierCommand = {
      id: newSupplier.entityId.id,
      name: 'New Supplier Name',
      telephone: '987654321',
      socialMedia: 'newSocialMedia',
      isActive: false,
    };

    const updatedSupplier: UpdateSupplierResult =
      await updateSupplierUseCase.execute(supplierInput);

    // Assert
    expect(supplierRepository.update).toHaveBeenCalledTimes(1);
    expect(updatedSupplier).toBeDefined();
    expect(updatedSupplier.name).toBe('New Supplier Name');
    expect(updatedSupplier.telephone).toBe('987654321');
    expect(updatedSupplier.socialMedia).toBe('newSocialMedia');
    expect(updatedSupplier.isActive).toBe(false);
    expect(updateSupplierUseCase.getUncommittedEvents()).toHaveLength(1);
  });

  it('should throw error when supplier not found', async () => {
    // Arrange
    const supplierRepository = {
      insert: jest.fn(),
      update: jest.fn().mockImplementation(() => {
        throw new Error('Supplier not found');
      }),
      exists: jest.fn().mockReturnValue(false),
      findById: jest.fn(),
      findAll: jest.fn(),
      search: jest.fn(),
      sortableFields: [],
    };

    const updateSupplierUseCase = new UpdateSupplierCommandHandler(
      supplierRepository,
    );
    const supplierInput: UpdateSupplierCommand = {
      id: new Uuid().id,
      name: 'New Supplier Name',
      telephone: '987654321',
      socialMedia: 'newSocialMedia',
      isActive: false,
    };

    // Act
    try {
      await updateSupplierUseCase.execute(supplierInput);
    } catch (error) {
      // Assert
      expect(error).toBeDefined();
      expect(error.message).toBe('Supplier not found');
    }
  });
});
