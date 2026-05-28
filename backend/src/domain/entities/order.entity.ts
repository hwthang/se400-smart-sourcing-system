// src/domain/entities/order.entity.ts

import { OrderStatus } from "../enums/order-status.enum";

export interface OrderData {
  id?: string;
  registrationId: string;
  allocationScore: number;
  assignedQuantity: number;
  estimatedAmount: number;
  deliveryDate: Date;
  defectRate: number;
  paidAmount: number;
  status: OrderStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateOrderProps {
  registrationId: string;
  allocationScore: number;
  assignedQuantity: number;
  estimatedAmount: number;
}

export class Order {
  // =========================================================
  // STRICT ENCAPSULATION (Private & Underscored)
  // =========================================================
  private _id?: string;
  private _registrationId: string;
  private _allocationScore: number;
  private _assignedQuantity: number;
  private _estimatedAmount: number;
  private _deliveryDate: Date;
  private _defectRate: number;
  private _paidAmount: number;
  private _status: OrderStatus;
  private _createdAt?: Date;
  private _updatedAt?: Date;

  // Constructor used for re-hydration via Mapper only
  public constructor(data: OrderData) {
    this._id = data.id;
    this._registrationId = data.registrationId;
    this._allocationScore = data.allocationScore;
    this._assignedQuantity = data.assignedQuantity;
    this._estimatedAmount = data.estimatedAmount;
    this._deliveryDate = data.deliveryDate;
    this._defectRate = data.defectRate;
    this._paidAmount = data.paidAmount;
    this._status = data.status;
    this._createdAt = data.createdAt;
    this._updatedAt = data.updatedAt;
  }

  // =========================================================
  // DUAL-GATE INITIALIZATION (Only method in design)
  // =========================================================
  public static create(props: CreateOrderProps): Order {
    // CHECK: allocation score must be within valid range

    return new Order({
      registrationId: props.registrationId, // Empty default - to be generated
      allocationScore: props.allocationScore,
      assignedQuantity: props.assignedQuantity,
      estimatedAmount: props.estimatedAmount,
      deliveryDate: new Date(),
      defectRate: 0,
      paidAmount: 0,
      status: OrderStatus.CREATED,
    });
  }

  // =========================================================
  // METHOD-BASED GETTERS
  // =========================================================
  get id(): string | undefined {
    return this._id;
  }
  get registrationId(): string {
    return this._registrationId;
  }
  get allocationScore(): number {
    return this._allocationScore;
  }
  get assignedQuantity(): number {
    return this._assignedQuantity;
  }
  get estimatedAmount(): number {
    return this._estimatedAmount;
  }
  get deliveryDate(): Date {
    return this._deliveryDate;
  }
  get defectRate(): number {
    return this._defectRate;
  }
  get paidAmount(): number {
    return this._paidAmount;
  }
  get status(): OrderStatus {
    return this._status;
  }
  get createdAt(): Date | undefined {
    return this._createdAt;
  }
  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }
  private validateStatus(allowedStatuses: OrderStatus[]): void {
    if (!allowedStatuses.includes(this._status)) {
      throw new Error(`Action not allowed in current status: ${this._status}`);
    }
  }

  confirm(): void {
    this.validateStatus([OrderStatus.CREATED]);

    this._status = OrderStatus.CONFIRMED;
  }

  startDelivery() {
    this.validateStatus([OrderStatus.CONFIRMED]);

    this._status = OrderStatus.DELIVERING;
  }

  markDelivered(deliveryDate: Date) {
    this.validateStatus([OrderStatus.DELIVERING]);

    this._status = OrderStatus.DELIVERED;
    this._deliveryDate = deliveryDate;
  }

  startInspection() {
    this.validateStatus([OrderStatus.DELIVERED]);

    this._status = OrderStatus.INSPECTING;
  }

  markInspected(defectRate: number) {
    this.validateStatus([OrderStatus.INSPECTING]);

    this._status = OrderStatus.INSPECTED;
    this._defectRate = defectRate;
  }

  complete(amount: number) {
    this.validateStatus([OrderStatus.INSPECTED]);

    this._paidAmount = amount;

    this._status = OrderStatus.COMPLETED;
  }
}
