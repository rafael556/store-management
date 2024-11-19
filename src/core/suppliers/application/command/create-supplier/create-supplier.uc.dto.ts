export type CreateSupplierCommand = {
  name: string;
  telephone: string;
  socialMedia: string;
};

export type CreateSupplierResult = {
  supplierId: string;
  name: string;
  telephone: string;
  socialMedia: string;
  isActive: boolean;
};
