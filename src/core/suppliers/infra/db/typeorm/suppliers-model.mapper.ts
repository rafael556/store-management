import { Supplier } from "src/core/suppliers/domain/supplier.aggregate";
import { SupplierEntity } from "./suppliers.entity";
import { Uuid } from "src/core/shared/domain/value-objects/uuid.vo";

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

    static toDomain(supplierEntity: SupplierEntity): Supplier {
        return new Supplier({
            supplierId: new Uuid(supplierEntity.supplierId),
            name: supplierEntity.supplierName,
            telephone: supplierEntity.supplierTelephone,
            socialMedia: supplierEntity.supplierSocialMedia,
            isActive: supplierEntity.supplierIsActive,
        });
    }
}
