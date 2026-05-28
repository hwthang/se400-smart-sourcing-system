// =========================================================
// APPLICATION LAYER: REPOSITORY INTERFACE
// =========================================================
// File: application/repositories/order.repo.ts

import { Order } from "../../domain/entities/order.entity";
import { OrderStatus } from "../../domain/enums/order-status.enum";

export type FindAllOrdersFilter = {
  contractId?: string;
  registrationId?: string;
  supplierId?: string;
  status?: string;
};

export interface OrderQuery {
  contractId?: string;
  registrationId?: string;
  supplierId?: string;
  statuses?: OrderStatus[];
  minTotalAmount?: number;
  maxTotalAmount?: number;
  startDate?: Date;
  endDate?: Date;
  page: number;
  limit: number;
}

export interface OrderSearchResult {
  items: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface OrderRepository {
  findById(id: string): Promise<Order | null>;
  findByRegistrationId(registrationId: string): Promise<Order | null>;
  findAll(filter?: FindAllOrdersFilter): Promise<Order[]>;
  save(order: Order): Promise<Order>;
  findMany(params: OrderQuery): Promise<OrderSearchResult>;
}