import { Supplier } from 'src/core/suppliers/domain/supplier.aggregate';
import {
  CreateSupplierCommand,
  CreateSupplierResult,
} from './create-supplier.command.dto';
import { Uuid } from 'src/core/shared/domain/value-objects/uuid.vo';
import { ISupplierRepository } from 'src/core/suppliers/domain/supplier.repository.interface';
import { CommandHandler } from 'src/core/shared/application/command-handler.interface';

export class CreateSupplierCommandHandler
  implements CommandHandler<CreateSupplierCommand, CreateSupplierResult>
{
  constructor(private readonly supplierRepository: ISupplierRepository) {}

  async execute(input: CreateSupplierCommand): Promise<CreateSupplierResult> {
    const supplier = new Supplier({
      supplierId: new Uuid(),
      name: input.name,
      telephone: input.telephone,
      socialMedia: input.socialMedia,
      isActive: true,
    });

    await this.supplierRepository.insert(supplier);

    return {
      supplierId: supplier.entityId.id,
      name: supplier.name,
      telephone: supplier.telephone,
      socialMedia: supplier.socialMedia,
      isActive: supplier.isActive(),
    };
  }
}
