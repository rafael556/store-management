import { Supplier } from "./supplier.aggregate";

export interface ISupplierRepository {
    saveSupplier(supplier: Supplier): Promise<void>;
    updateSupplier(supplierId: string, supplier: Supplier): Promise<void>;
    exists(supplierId: string): Promise<boolean>;
    findSupplier(supplierId: string): Promise<Supplier>;
    listSuppliers(): Promise<Supplier[]>;
}