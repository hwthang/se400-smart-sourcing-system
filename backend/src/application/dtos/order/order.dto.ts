// src/application/dtos/order.dto.ts

import { OrderStatus } from "../../../domain/enums/order-status.enum";

export interface OrderDto {
  id: string; // Guaranteed non-optional for API contract
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