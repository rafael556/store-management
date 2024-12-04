import { Uuid } from 'src/core/shared/domain/value-objects/uuid.vo';

type SupplierProps = {
  supplierId: Uuid;
  name: string;
  telephone: string;
  socialMedia: string;
  isActive: boolean;
};

export class Supplier {
  private readonly _supplierId: Uuid;
  private _name: string;
  private _telephone: string;
  private _socialMedia: string;
  private _isActive: boolean = true;

  constructor(props: SupplierProps) {
    this._supplierId = props.supplierId;
    this._name = props.name;
    this._telephone = props.telephone;
    this._socialMedia = props.socialMedia;
    this._isActive = props.isActive;
    this.validate();
  }

  activate() {
    this._isActive = true;
  }

  deactivate() {
    this._isActive = false;
  }

  changeName(name: string) {
    this._name = name;
  }

  changeTelephone(telephone: string) {
    this._telephone = telephone;
  }

  changeSocialMedia(socialMedia: string) {
    this._socialMedia = socialMedia;
  }

  validate(): boolean {
    if (this._name.length < 3) {
      throw new InvalidSupplierNameError();
    }

    if (this._telephone.length < 6) {
      throw new InvalidSupplierTelephoneError();
    }

    if (this._socialMedia.length < 3) {
      throw new InvalidSupplierSocialMediaError();
    }

    return true;
  }

  get entityId(): Uuid {
    return this._supplierId;
  }

  isActive(): boolean {
    return this._isActive;
  }

  get name(): string {
    return this._name;
  }

  get telephone(): string {
    return this._telephone;
  }

  get socialMedia(): string {
    return this._socialMedia;
  }
}

export class InvalidSupplierNameError extends Error {
  constructor(message?: string) {
    super(message || `Invalid Supplier Name`);
    this.name = 'InvalidSupplierNameError';
  }
}

export class InvalidSupplierTelephoneError extends Error {
  constructor(message?: string) {
    super(message || `Invalid Supplier Telephone`);
    this.name = 'InvalidSupplierTelephoneError';
  }
}

export class InvalidSupplierSocialMediaError extends Error {
  constructor(message?: string) {
    super(message || `Invalid Supplier Social Media`);
    this.name = 'InvalidSupplierSocialMediaError';
  }
}
