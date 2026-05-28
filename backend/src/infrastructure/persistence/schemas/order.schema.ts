// src/infrastructure/schemas/order.schema.ts

import mongoose, { Schema, Document } from "mongoose";
import { OrderStatus } from "../../../domain/enums/order-status.enum";

export interface OrderDocument extends Document {
  registrationId: string;
  allocationScore: number;
  assignedQuantity: number;
  estimatedAmount: number;
  deliveryDate: Date;
  defectRate: number;
  paidAmount: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<OrderDocument>(
  {
    registrationId: { type: String, required: true, unique: true },
    // DATABASE CONSTRAINTS: Enforce business rules at persistence layer
    allocationScore: { type: Number, required: true, min: 0, max: 100 },
    assignedQuantity: { type: Number, required: true, min: 1 },
    estimatedAmount: { type: Number, required: true, min: 0, default: 0 },
    deliveryDate: { type: Date, required: true },
    defectRate: { type: Number, required: true, min: 0, default: 0 },
    paidAmount: { type: Number, required: true, min: 0, default: 0 },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.CREATED,
      required: true,
    },
  },
  {
    timestamps: true, // Auto-manage createdAt and updatedAt
    versionKey: false,
  }
);

export const OrderModel = mongoose.model<OrderDocument>("Order", OrderSchema);