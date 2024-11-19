import { QueryHandler } from "src/core/shared/application/query-handler.interface";
import { DetailSupplierQuery, DetailSupplierResponse } from "./detail-supplier.uc.dto";
import { ISupplierRepository } from "src/core/suppliers/domain/supplier.repository.interface";
import { Logger } from "@nestjs/common";

export default class DetailSupplierUseCase implements QueryHandler<DetailSupplierQuery, DetailSupplierResponse> {
    constructor(private readonly supplierRepository: ISupplierRepository){}

    async execute(query: DetailSupplierQuery): Promise<DetailSupplierResponse> {
        const exists = await this.supplierRepository.exists(query.supplierId);

        if (!exists) {
            Logger.error(`Supplier with id ${query.supplierId} not found`);
            throw new Error('Supplier not found');
        }

        const supplier = await this.supplierRepository.findSupplier(query.supplierId);

        return {
            supplierId: supplier.entityId.id,
            name: supplier.name,
            telephone: supplier.telephone,
            socialMedia: supplier.socialMedia,
            isActive: supplier.isActive()
        }
    }
}