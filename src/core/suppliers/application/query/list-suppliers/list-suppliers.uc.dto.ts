import { Supplier } from "src/core/suppliers/domain/supplier.aggregate"

export type ListSuppliersResult = {
    suppliers: Supplier[];
}