import { ISupplierRepository } from "src/core/suppliers/domain/supplier.repository.interface";
import { DataSource, Repository } from "typeorm";
import { SupplierEntity } from "./suppliers.entity";
import { Supplier } from "src/core/suppliers/domain/supplier.aggregate";
import { SupplierMapper } from "./suppliers-model.mapper";
import { Logger } from "@nestjs/common";

export class SupplierTypeOrmRepository implements ISupplierRepository {
    private readonly repository: Repository<SupplierEntity>;

    constructor(private readonly dataSource: DataSource) {
      this.repository = dataSource.getRepository(SupplierEntity);
    }

    async saveSupplier(supplier: Supplier): Promise<void> {
        const supplierEntity = SupplierMapper.toModel(supplier);

        supplierEntity.supplierCreatedAt = new Date();
        supplierEntity.supplierUpdatedAt = new Date();

        try {
            await this.repository.save(supplierEntity);
        } catch (error) {
            Logger.error(`Error saving supplier: ${error}`, error.stack, 'SupplierTypeOrmRepository');
            throw new Error('Error saving supplier');
        }   
    }

    async updateSupplier(supplierId: string, supplier: Supplier): Promise<void> {
        const exists = await this.repository.exists({where: {supplierId}});

        if (!exists) {
            throw new Error('Supplier not found');
        }
        
        const supplierEntity = SupplierMapper.toModel(supplier);
        supplierEntity.supplierUpdatedAt = new Date();
        
        await this.repository.update(supplierId, supplierEntity);
    }
}