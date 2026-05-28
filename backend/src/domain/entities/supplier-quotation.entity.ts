// src/domain/entities/supplier-quotation.entity.ts
import { SupplierQuotationStatus } from "../enums/supplier-quotation-status.enum";

export interface SupplierQuotationData {
  id?: string;
  registrationId: string;
  unitPrice: number;
  maxLeadTimeDays: number;
  maxDefectRate: number;
  minSupplyQuantity: number;
  maxSupplyQuantity: number;
  status: SupplierQuotationStatus;
  rejectReason: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateSupplierQuotationProps {
  registrationId: string;
  unitPrice: number;
  maxLeadTimeDays: number;
  maxDefectRate: number;
  minSupplyQuantity: number;
  maxSupplyQuantity: number;
}

export interface UpdateSupplierQuotationProps {
  unitPrice?: number;
  maxLeadTimeDays?: number;
  maxDefectRate?: number | null;
  minSupplyQuantity?: number;
  maxSupplyQuantity?: number;
}

export class SupplierQuotation {
  // 1. STRICT ENCAPSULATION (Private & Underscored)
  private _id?: string;
  private _registrationId: string;
  private _unitPrice: number;
  private _maxLeadTimeDays: number;
  private _maxDefectRate: number;
  private _minSupplyQuantity: number;
  private _maxSupplyQuantity: number;
  private _status: SupplierQuotationStatus;
  private _rejectReason: string;
  private _createdAt?: Date;
  private _updatedAt?: Date;

  // Constructor used for re-hydration via Mapper
  public constructor(data: SupplierQuotationData) {
    this._id = data.id;
    this._registrationId = data.registrationId;
    this._unitPrice = data.unitPrice;
    this._maxLeadTimeDays = data.maxLeadTimeDays;
    this._maxDefectRate = data.maxDefectRate;
    this._minSupplyQuantity = data.minSupplyQuantity;
    this._maxSupplyQuantity = data.maxSupplyQuantity;
    this._status = data.status;
    this._rejectReason = data.rejectReason;
    this._createdAt = data.createdAt;
    this._updatedAt = data.updatedAt;
  }

  // 2. DUAL-GATE INITIALIZATION (Static create for new entities)
  public static create(props: CreateSupplierQuotationProps): SupplierQuotation {
    return new SupplierQuotation({
      registrationId: props.registrationId,
      unitPrice: props.unitPrice,
      maxLeadTimeDays: props.maxLeadTimeDays,
      maxDefectRate: props.maxDefectRate,
      minSupplyQuantity: props.minSupplyQuantity,
      maxSupplyQuantity: props.maxSupplyQuantity,
      status: SupplierQuotationStatus.CREATED,
      rejectReason: "",
    });
  }

  // 3. METHOD-BASED GETTERS
  get id(): string | undefined {
    return this._id;
  }
  get registrationId(): string {
    return this._registrationId;
  }
  get unitPrice(): number {
    return this._unitPrice;
  }
  get maxLeadTimeDays(): number {
    return this._maxLeadTimeDays;
  }
  get maxDefectRate(): number {
    return this._maxDefectRate;
  }
  get minSupplyQuantity(): number {
    return this._minSupplyQuantity;
  }
  get maxSupplyQuantity(): number {
    return this._maxSupplyQuantity;
  }
  get status(): SupplierQuotationStatus {
    return this._status;
  }
  get rejectReason(): string {
    return this._rejectReason;
  }
  get createdAt(): Date | undefined {
    return this._createdAt;
  }
  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }

  // 4. BEHAVIORAL MUTATOR WITH INVARIANT VALIDATION
  public update(props: UpdateSupplierQuotationProps): void {
    this.validateStatus([
      SupplierQuotationStatus.CREATED,
      SupplierQuotationStatus.REJECTED,
    ]);

    if (props.unitPrice !== undefined) {
      if (props.unitPrice <= 0)
        throw new Error("Unit price must be greater than zero");
      this._unitPrice = props.unitPrice;
    }

    if (props.maxLeadTimeDays !== undefined) {
      if (props.maxLeadTimeDays <= 0)
        throw new Error("Max lead time days must be greater than zero");
      this._maxLeadTimeDays = props.maxLeadTimeDays;
    }

    if (props.maxDefectRate !== undefined) {
      this._maxDefectRate = props.maxDefectRate ?? 0;
    }

    let newMinSupply = this._minSupplyQuantity;
    let newMaxSupply = this._maxSupplyQuantity;

    if (props.minSupplyQuantity !== undefined) {
      if (props.minSupplyQuantity <= 0)
        throw new Error("Min supply quantity must be greater than zero");
      newMinSupply = props.minSupplyQuantity;
    }

    if (props.maxSupplyQuantity !== undefined) {
      if (props.maxSupplyQuantity <= 0)
        throw new Error("Max supply quantity must be greater than zero");
      newMaxSupply = props.maxSupplyQuantity;
    }

    if (newMinSupply > newMaxSupply) {
      throw new Error("Min supply quantity cannot exceed max supply quantity");
    }

    this._minSupplyQuantity = newMinSupply;
    this._maxSupplyQuantity = newMaxSupply;
  }

  private validateStatus(allowedStatuses: SupplierQuotationStatus[]): void {
    if (!allowedStatuses.includes(this._status)) {
      throw new Error(`Action not allowed in current status: ${this._status}`);
    }
  }

  submit(): void {
    this.validateStatus([
      SupplierQuotationStatus.CREATED,
      SupplierQuotationStatus.REJECTED,
    ]);
    this._rejectReason = "";
    this._status = SupplierQuotationStatus.SUBMITTED;
  }

  reject(reason: string): void {
    this.validateStatus([SupplierQuotationStatus.SUBMITTED]);
    this._rejectReason = reason;
    this._status = SupplierQuotationStatus.REJECTED;
  }

  approve(): void {
    this.validateStatus([SupplierQuotationStatus.SUBMITTED]);
    this._status = SupplierQuotationStatus.APPROVED;
  }

  markPendingConfirmation(): void {
    this.validateStatus([SupplierQuotationStatus.APPROVED]);
    this._status = SupplierQuotationStatus.PENDING_CONFIRMATION;
  }

  markConfirmed(): void {
    this.validateStatus([SupplierQuotationStatus.PENDING_CONFIRMATION]);
    this._status = SupplierQuotationStatus.CONFIRMED;
  }
}
