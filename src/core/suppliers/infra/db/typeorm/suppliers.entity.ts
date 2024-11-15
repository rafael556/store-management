import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('suppliers')
export class SupplierEntity {

    @PrimaryGeneratedColumn('uuid')
    supplierId: string;

    @Column({nullable: false, unique: true})
    supplierName: string;

    @Column({nullable: false})
    supplierTelephone: string;

    @Column({nullable: false})
    supplierSocialMedia: string;

    @Column({nullable: false})
    supplierIsActive: boolean;

    @Column({nullable: false, update: false})
    supplierCreatedAt: Date;

    @Column({nullable: false})
    supplierUpdatedAt: Date;
}