import { CommandHandler } from 'src/core/shared/application/command-handler.interface';
import {
  UpdateSupplierCommand,
  UpdateSupplierResult,
} from './update-supplier.command.dto';
import { ISupplierRepository } from 'src/core/suppliers/domain/supplier.repository.interface';
import { Supplier } from 'src/core/suppliers/domain/supplier.aggregate';
import { Uuid } from 'src/core/shared/domain/value-objects/uuid.vo';

export default class UpdateSupplierCommandHandler
  implements CommandHandler<UpdateSupplierCommand, UpdateSupplierResult>
{
  constructor(private readonly supplierRepository: ISupplierRepository) {}

  async execute(command: UpdateSupplierCommand): Promise<UpdateSupplierResult> {
    const exists = await this.supplierRepository.exists(command.id);

    if (!exists) {
      throw new Error('Supplier not found');
    }

    const supplier = new Supplier({
      supplierId: new Uuid(command.id),
      name: command.name,
      telephone: command.telephone,
      socialMedia: command.socialMedia,
      isActive: command.isActive,
    });

    await this.supplierRepository.update(command.id, supplier);

    return {
      id: supplier.entityId.id,
      name: supplier.name,
      telephone: supplier.telephone,
      socialMedia: supplier.socialMedia,
      isActive: supplier.isActive(),
    };
  }
}
