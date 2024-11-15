export type CreateSupplierInputDto = {
  name: string;
  telephone: string;
  socialMedia: string;
};

export type CreateSupplierOutputDto = {
  supplierId: string;
  name: string;
  telephone: string;
  socialMedia: string;
  isActive: boolean;
};
