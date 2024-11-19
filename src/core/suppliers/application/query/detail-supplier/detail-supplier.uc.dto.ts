
export type DetailSupplierQuery = {
    supplierId: string;
}

export type DetailSupplierResponse = {
    supplierId: string;
    name: string;
    telephone: string;
    socialMedia: string;
    isActive: boolean;
}