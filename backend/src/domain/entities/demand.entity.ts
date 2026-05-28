import { DemandStatus } from "../enums/demand-status.enum";
import { Product } from "../value-objects/product.vo";

interface DemandData {
  id?: string;
  customerId: string;
  assignedEmployeeId: string;
  product: Product;
  requestedQuantity: number;
  requestedDeliveryDate: Date;
  status: DemandStatus;
  rejectReason: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CreateDemandData {
  customerId: string;
  product: Product;
  requestedQuantity: number;
  requestedDeliveryDate: Date;
}

interface UpdateDemandData {
  product?: Product;
  requestedQuantity?: number;
  requestedDeliveryDate?: Date;
}

export class Demand {
  private _id?: string;
  private _customerId: string;
  private _assignedEmployeeId: string;
  private _product: Product;
  private _requestedQuantity: number;
  private _requestedDeliveryDate: Date;
  private _status: DemandStatus;
  private _rejectReason: string;
  private _createdAt?: Date;
  private _updatedAt?: Date;

  constructor(data: DemandData) {
    this._id = data.id;
    this._customerId = data.customerId;
    this._assignedEmployeeId = data.assignedEmployeeId;
    this._product = data.product;
    this._requestedQuantity = data.requestedQuantity;
    this._requestedDeliveryDate = data.requestedDeliveryDate;
    this._status = data.status;
    this._rejectReason = data.rejectReason;
    this._createdAt = data.createdAt;
    this._updatedAt = data.updatedAt;
  }

  get id(): string | undefined {
    return this._id;
  }

  get customerId(): string {
    return this._customerId;
  }

  get assignedEmployeeId(): string {
    return this._assignedEmployeeId;
  }

  get product(): Product {
    return this._product;
  }

  get requestedQuantity(): number {
    return this._requestedQuantity;
  }

  get requestedDeliveryDate(): Date {
    return this._requestedDeliveryDate;
  }

  get status(): DemandStatus {
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

  private validateStatus(allowedStatuses: DemandStatus[]): void {
    if (!allowedStatuses.includes(this._status)) {
      throw new Error(
        `Invalid status: ${this._status}. Allowed statuses: ${allowedStatuses.join(", ")}`,
      );
    }
  }

  static create(data: CreateDemandData): Demand {
    const demand = new Demand({
      customerId: data.customerId,
      assignedEmployeeId: "",
      product: data.product,
      requestedQuantity: data.requestedQuantity,
      requestedDeliveryDate: data.requestedDeliveryDate,
      status: DemandStatus.CREATED,
      rejectReason: "",
    });
    return demand;
  }

  update(data: UpdateDemandData): void {
    this.validateStatus([DemandStatus.CREATED, DemandStatus.REJECTED]);

    if (data.product !== undefined) {
      this._product = data.product;
    }
    if (data.requestedQuantity !== undefined) {
      this._requestedQuantity = data.requestedQuantity;
    }
    if (data.requestedDeliveryDate !== undefined) {
      this._requestedDeliveryDate = data.requestedDeliveryDate;
    }
  }

  submit(): void {
    this.validateStatus([DemandStatus.CREATED, DemandStatus.REJECTED]);

    this._status = DemandStatus.SUBMITTED;
    this._rejectReason = "";
    this._assignedEmployeeId = "";
  }

  assignEmployee(employeeId: string): void {
    this.validateStatus([DemandStatus.SUBMITTED]);

    this._assignedEmployeeId = employeeId;
    this._status = DemandStatus.IN_REVIEW;
  }

  approve(): void {
    this.validateStatus([DemandStatus.IN_REVIEW]);

    this._status = DemandStatus.APPROVED;
    this._rejectReason = "";
  }

  reject(reason: string): void {
    this.validateStatus([DemandStatus.IN_REVIEW]);

    this._status = DemandStatus.REJECTED;
    this._rejectReason = reason;
  }

    markContracted(): void {
    this.validateStatus([DemandStatus.APPROVED]);

    this._status = DemandStatus.CONTRACTED;
  }

  markPendingConfirmation(): void {
    this.validateStatus([DemandStatus.CONTRACTED]);

    this._status = DemandStatus.PENDING_CONFIRMATION;
  }

  confirm(): void {
    this.validateStatus([DemandStatus.PENDING_CONFIRMATION]);

    this._status = DemandStatus.CONFIRMED;
  }
}
