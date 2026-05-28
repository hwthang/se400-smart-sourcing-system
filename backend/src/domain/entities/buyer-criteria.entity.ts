// src/domain/entities/buyer-criteria.entity.ts
import { BuyerCriteriaStatus } from "../enums/buyer-criteria-status.enum";

export interface BuyerCriteriaData {
  id?: string;
  registrationId: string;
  minPurchaseQuantity: number;
  maxAllocationPercent: number;
  status: BuyerCriteriaStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateBuyerCriteriaProps {
  registrationId: string;
  minPurchaseQuantity: number;
  maxAllocationPercent: number;
}

export interface UpdateBuyerCriteriaProps {
  minPurchaseQuantity?: number;
  maxAllocationPercent?: number;
}

export class BuyerCriteria {
  // 1. STRICT ENCAPSULATION (Private & Underscored)
  private _id?: string;
  private _registrationId: string;
  private _minPurchaseQuantity: number;
  private _maxAllocationPercent: number;
  private _status: BuyerCriteriaStatus;
  private _createdAt?: Date;
  private _updatedAt?: Date;

  // Constructor used for re-hydration via Mapper
  public constructor(data: BuyerCriteriaData) {
    this._id = data.id;
    this._registrationId = data.registrationId;
    this._minPurchaseQuantity = data.minPurchaseQuantity;
    this._maxAllocationPercent = data.maxAllocationPercent;
    this._status = data.status;
    this._createdAt = data.createdAt;
    this._updatedAt = data.updatedAt;
  }

  // 2. DUAL-GATE INITIALIZATION (Static create for new entities)
  public static create(props: CreateBuyerCriteriaProps): BuyerCriteria {
    return new BuyerCriteria({
      registrationId: props.registrationId,
      minPurchaseQuantity: props.minPurchaseQuantity,
      maxAllocationPercent: props.maxAllocationPercent,
      status: BuyerCriteriaStatus.CREATED,
    });
  }

  // 3. METHOD-BASED GETTERS
  get id(): string | undefined {
    return this._id;
  }
  get registrationId(): string {
    return this._registrationId;
  }
  get minPurchaseQuantity(): number {
    return this._minPurchaseQuantity;
  }
  get maxAllocationPercent(): number {
    return this._maxAllocationPercent;
  }
  get status(): BuyerCriteriaStatus {
    return this._status;
  }
  get createdAt(): Date | undefined {
    return this._createdAt;
  }
  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }

  // 4. BEHAVIORAL MUTATOR WITH INVARIANT VALIDATION
  public update(props: UpdateBuyerCriteriaProps): void {
    this.validateStatus([BuyerCriteriaStatus.CREATED]);

    if (props.minPurchaseQuantity !== undefined) {
      this._minPurchaseQuantity = props.minPurchaseQuantity;
    }

    if (props.maxAllocationPercent !== undefined) {
      this._maxAllocationPercent = props.maxAllocationPercent;
    }
  }

  private validateStatus(allowedStatuses: BuyerCriteriaStatus[]): void {
    if (!allowedStatuses.includes(this._status)) {
      throw new Error(`Action not allowed in current status: ${this._status}`);
    }
  }

  confirm() {
    this.validateStatus([BuyerCriteriaStatus.CREATED]);

    this._status = BuyerCriteriaStatus.CONFIRMED;
  }
}
