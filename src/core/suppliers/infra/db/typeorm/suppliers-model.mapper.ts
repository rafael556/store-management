import { Supplier } from "src/core/suppliers/domain/supplier.aggregate";
import { SupplierEntity } from "./suppliers.entity";

export class SupplierMapper {
    static toModel(supplier: Supplier): SupplierEntity {
        const supplierEntity = new SupplierEntity();
        supplierEntity.supplierId = supplier.entityId.id;
        supplierEntity.supplierName = supplier.name;
        supplierEntity.supplierTelephone = supplier.telephone;
        supplierEntity.supplierSocialMedia = supplier.socialMedia;
        supplierEntity.supplierIsActive = supplier.isActive();
        return supplierEntity;
    }
}
