import { Uuid } from "src/core/shared/domain/value-objects/uuid.vo"
import { Supplier } from "../supplier.aggregate"

describe('SupplierAggregate', () => {

    it('should create a new supplier', () => {
        const props = {
            supplierId: new Uuid(),
            name: 'Supplier Name',
            telephone: '123456789',
            socialMedia: 'socialMedia',
            isActive: true
        }

        const validateSpy = jest.spyOn(Supplier.prototype as any, 'validate')
        
        const supplier = new Supplier(props)

        expect(supplier).toBeInstanceOf(Supplier)
        expect(supplier.entityId).toBeDefined()
        expect(validateSpy).toHaveBeenCalled()
    })

    it('should activate a supplier', () => {
        const props = {
            supplierId: new Uuid(),
            name: 'Supplier Name',
            telephone: '123456789',
            socialMedia: 'socialMedia',
            isActive: false
        }

        const supplier = new Supplier(props)

        supplier.activate()

        expect(supplier.isActive).toBeTruthy()
    })

    it('should deactivate a supplier', () => {
        const props = {
            supplierId: new Uuid(),
            name: 'Supplier Name',
            telephone: '123456789',
            socialMedia: 'socialMedia',
            isActive: true
        }

        const supplier = new Supplier(props)

        supplier.deactivate()

        expect(supplier.isActive()).toBeFalsy()
    })

    it('should change supplier name', () => {
        const props = {
            supplierId: new Uuid(),
            name: 'Supplier Name',
            telephone: '123456789',
            socialMedia: 'socialMedia',
            isActive: true
        }

        const supplier = new Supplier(props)

        supplier.changeName('New Supplier Name')

        expect(supplier.name).toBe('New Supplier Name')
    })

    it('should change supplier telephone', () => {
        const props = {
            supplierId: new Uuid(),
            name: 'Supplier Name',
            telephone: '123456789',
            socialMedia: 'socialMedia',
            isActive: true
        }

        const supplier = new Supplier(props)

        supplier.changeTelephone('987654321')

        expect(supplier.telephone).toBe('987654321')
    })

    it('should change supplier social media', () => {
        const props = {
            supplierId: new Uuid(),
            name: 'Supplier Name',
            telephone: '123456789',
            socialMedia: 'socialMedia',
            isActive: true
        }

        const supplier = new Supplier(props)

        supplier.changeSocialMedia('newSocialMedia')

        expect(supplier.socialMedia).toBe('newSocialMedia')
    })

    it('should throw InvalidSupplierNameError', () => {
        const props = {
            supplierId: new Uuid(),
            name: 'Su',
            telephone: '123456789',
            socialMedia: 'socialMedia',
            isActive: true
        }

        expect(() => new Supplier(props)).toThrow('Invalid Supplier Name')
    })

    it('should throw InvalidSupplierTelephoneError', () => {
        const props = {
            supplierId: new Uuid(),
            name: 'Supplier Name',
            telephone: '123',
            socialMedia: 'socialMedia',
            isActive: true
        }

        expect(() => new Supplier(props)).toThrow('Invalid Supplier Telephone')
    })

    it('should throw InvalidSupplierSocialMediaError', () => {
        const props = {
            supplierId: new Uuid(),
            name: 'Supplier Name',
            telephone: '123456789',
            socialMedia: 'so',
            isActive: true
        }

        expect(() => new Supplier(props)).toThrow('Invalid Supplier Social Media')
    })
})