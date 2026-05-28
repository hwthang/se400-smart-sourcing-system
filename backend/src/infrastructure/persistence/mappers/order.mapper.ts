// src/infrastructure/mappers/order.mapper.ts

import { Order } from "../../../domain/entities/order.entity";
import { OrderDocument } from "../schemas/order.schema";
import { OrderDto } from "../../../application/dtos/order/order.dto";

export class OrderMapper {
  // =========================================================
  // A. DOMAIN ENTITY ➡️ DATABASE DOCUMENT
  // Purpose: Extract primitive values for persistence
  // =========================================================
  public static toPersistence(entity: Order): Partial<OrderDocument> {
    return {
      registrationId: entity.registrationId,
      allocationScore: entity.allocationScore,
      assignedQuantity: entity.assignedQuantity,
      estimatedAmount: entity.estimatedAmount,
      deliveryDate: entity.deliveryDate,
      defectRate: entity.defectRate,
      paidAmount: entity.paidAmount,
      status: entity.status,
    };
  }

  // =========================================================
  // B. DATABASE DOCUMENT ➡️ DOMAIN ENTITY
  // Purpose: Re-hydrate domain entity from database
  // =========================================================
  public static toDomain(doc: OrderDocument): Order {
    return new Order({
      id: doc._id.toString(),
      registrationId: doc.registrationId,
      allocationScore: doc.allocationScore,
      assignedQuantity: doc.assignedQuantity,
      estimatedAmount: doc.estimatedAmount,
      deliveryDate: doc.deliveryDate,
      defectRate: doc.defectRate,
      paidAmount: doc.paidAmount,
      status: doc.status,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  // =========================================================
  // C. DOMAIN ENTITY ➡️ CLEAN DTO
  // Purpose: Expose only primitives to client (no domain logic)
  // =========================================================
  public static toDto(entity: Order): OrderDto {
    return {
      id: entity.id ?? "", // Fallback: entity.id may be undefined during creation
      registrationId: entity.registrationId,
      allocationScore: entity.allocationScore,
      assignedQuantity: entity.assignedQuantity,
      estimatedAmount: entity.estimatedAmount,
      deliveryDate: entity.deliveryDate,
      defectRate: entity.defectRate,
      paidAmount: entity.paidAmount,
      status: entity.status,
      createdAt: entity.createdAt ?? new Date(), // Fallback for unsaved entities
      updatedAt: entity.updatedAt ?? new Date(),
    };
  }
}