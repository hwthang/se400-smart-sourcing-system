import { SupplierRegistrationStatus } from "../enums/supplier-registration-status.enum";

interface SupplierRegistrationData {
  id?: string;
  supplierId: string;
  contractId: string;
  status: SupplierRegistrationStatus;
  cancelReason: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CreateSupplierRegistrationData {
  supplierId: string;
  contractId: string;
}

export class SupplierRegistration {
  private _id?: string;
  private _supplierId: string;
  private _contractId: string;
  private _status: SupplierRegistrationStatus;
  private _cancelReason: string;
  private _createdAt?: Date;
  private _updatedAt?: Date;

  constructor(data: SupplierRegistrationData) {
    this._id = data.id;
    this._supplierId = data.supplierId;
    this._contractId = data.contractId;
    this._status = data.status;
    this._cancelReason = data.cancelReason;
    this._createdAt = data.createdAt;
    this._updatedAt = data.updatedAt;
  }

  get id(): string | undefined {
    return this._id;
  }

  get supplierId(): string {
    return this._supplierId;
  }

  get contractId(): string {
    return this._contractId;
  }

  get status(): SupplierRegistrationStatus {
    return this._status;
  }

  get cancelReason(): string {
    return this._cancelReason;
  }

  get createdAt(): Date | undefined {
    return this._createdAt;
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }

  // ============ Static Factory Method ============
  static create(data: CreateSupplierRegistrationData): SupplierRegistration {
    const registration = new SupplierRegistration({
      supplierId: data.supplierId,
      contractId: data.contractId,
      status: SupplierRegistrationStatus.CREATED,
      cancelReason: "",
    });
    return registration;
  }

  // ============ Validation Methods ============
  private validateStatus(allowedStatuses: SupplierRegistrationStatus[]): void {
    if (!allowedStatuses.includes(this._status)) {
      throw new Error(
        `Invalid registration status: ${this._status}. Allowed: ${allowedStatuses.join(", ")}`,
      );
    }
  }

  // ============ Business Methods ============
  confirm(): void {
    this.validateStatus([SupplierRegistrationStatus.CREATED]);
    this._status = SupplierRegistrationStatus.CONFIRMED;
  }

  cancel(reason: string): void {
    this.validateStatus([SupplierRegistrationStatus.CREATED]);

    if (!reason || reason.trim() === "") {
      throw new Error("Cancel reason is required");
    }

    this._status = SupplierRegistrationStatus.CANCELED;
    this._cancelReason = reason;
  }
}
