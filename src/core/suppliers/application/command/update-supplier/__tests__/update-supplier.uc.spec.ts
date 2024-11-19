import { Uuid } from "src/core/shared/domain/value-objects/uuid.vo";
import { UpdateSupplierCommand, UpdateSupplierResult } from "../update-supplier.uc.dto";
import { Supplier } from "src/core/suppliers/domain/supplier.aggregate";
import UpdateSupplierUseCase from "../update-supplier.uc";

describe('Update supplier unit test', () => {
  it('should update supplier', async () => {
    // Arrange
    const supplierRepository = {
      saveSupplier: jest.fn(),
      updateSupplier: jest.fn(),
      exists: jest.fn().mockReturnValue(true),
    };

    const newSupplier = new Supplier({
      supplierId: new Uuid(),
      name: 'Supplier Name',
      telephone: '123456789',
      socialMedia: 'socialMedia',
      isActive: true,
    });

    const updateSupplierUseCase = new UpdateSupplierUseCase(supplierRepository);
    const supplierInput :UpdateSupplierCommand = {
      id: newSupplier.entityId.id,
      name: 'New Supplier Name',
      telephone: '987654321',
      socialMedia: 'newSocialMedia',
      isActive: false,
    };

    const updatedSupplier: UpdateSupplierResult = await updateSupplierUseCase.execute(supplierInput);

    // Assert
    expect(supplierRepository.updateSupplier).toHaveBeenCalledTimes(1);
    expect(updatedSupplier).toBeDefined();
    expect(updatedSupplier.name).toBe('New Supplier Name');
    expect(updatedSupplier.telephone).toBe('987654321');
    expect(updatedSupplier.socialMedia).toBe('newSocialMedia');
    expect(updatedSupplier.isActive).toBe(false);
  });

    it('should throw error when supplier not found', async () => {
        // Arrange
        const supplierRepository = {
        saveSupplier: jest.fn(),
        updateSupplier: jest.fn().mockImplementation(() => {
            throw new Error('Supplier not found');
        }),
        exists: jest.fn().mockReturnValue(false),
        };
    
        const updateSupplierUseCase = new UpdateSupplierUseCase(supplierRepository);
        const supplierInput :UpdateSupplierCommand = {
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
