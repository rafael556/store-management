import { Uuid } from "src/core/shared/domain/value-objects/uuid.vo";
import { Supplier } from "src/core/suppliers/domain/supplier.aggregate";
import { ISupplierRepository } from "src/core/suppliers/domain/supplier.repository.interface";
import DetailSupplierUseCase from "../detail-supplier.uc";

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
            saveSupplier: jest.fn(),
            updateSupplier: jest.fn(),
            exists: jest.fn().mockReturnValue(true),
            findSupplier: jest.fn().mockResolvedValueOnce(supplier),
            listSuppliers: jest.fn(),
        }

        const usecase = new DetailSupplierUseCase(repository);

        // Act
        await repository.saveSupplier(supplier);
        const savedSupplier = await usecase.execute({supplierId: supplier.entityId.id});

        // Assert
        expect(savedSupplier).toBeDefined();
        expect(savedSupplier.name).toBe('Supplier Name');
        expect(savedSupplier.telephone).toBe('123456789');
        expect(savedSupplier.socialMedia).toBe('socialMedia');
        expect(savedSupplier.isActive).toBe(true);
    })

    it('should throw error when supplier not found', async () => {
        // Arrange
        const supplierId = new Uuid();

        const repository: ISupplierRepository = {
            saveSupplier: jest.fn(),
            updateSupplier: jest.fn(),
            exists: jest.fn().mockResolvedValueOnce(false),
            findSupplier: jest.fn().mockReturnValue(null),
            listSuppliers: jest.fn(),
        }

        const usecase = new DetailSupplierUseCase(repository);

        // Act
        try {
            await usecase.execute({supplierId: supplierId.id});
        } catch (error) {
            // Assert
            expect(error).toBeDefined();
            expect(error.message).toBe('Supplier not found');
        }
    })
})