import mongoose from "mongoose";
import { DemandDto } from "../../../application/dtos/demand/demand.dto";
import { Demand } from "../../../domain/entities/demand.entity";
import { Product } from "../../../domain/value-objects/product.vo";
import { DemandDocument } from "../schemas/demand.schema";

export class DemandMapper {
  static toPersistence(demand: Demand): Partial<DemandDocument> {
    return {
      customerId: new mongoose.Types.ObjectId(demand.customerId as string),
      assignedEmployeeId: demand.assignedEmployeeId
        ? new mongoose.Types.ObjectId(demand.assignedEmployeeId as string)
        : undefined,
      product: {
        name: demand.product.name,
        description: demand.product.description,
        sku: demand.product.sku,
        specifications: demand.product.specifications,
      },
      rejectReason: demand.rejectReason,
      requestedQuantity: demand.requestedQuantity,
      requestedDeliveryDate: demand.requestedDeliveryDate,
      status: demand.status,
    };
  }

  static toDomain(doc: DemandDocument): Demand {
    const product = new Product({
      sku: doc.product.sku,
      name: doc.product.name,
      description: doc.product.description,
      specifications: doc.product.specifications,
    });

    const demand = new Demand({
      id: doc._id.toString(),
      customerId: doc.customerId?.toString(),
      assignedEmployeeId: doc.assignedEmployeeId?.toString(),
      product: product,
      requestedQuantity: doc.requestedQuantity,
      requestedDeliveryDate: doc.requestedDeliveryDate,
      status: doc.status,
      rejectReason: doc.rejectReason,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });

    return demand;
  }

  static toDto(demand: Demand): DemandDto {
    return {
      id: demand.id ?? "",
      customerId: demand.customerId,
      assignedEmployeeId: demand.assignedEmployeeId,
      product: {
        name: demand.product.name,
        description: demand.product.description,
        sku: demand.product.sku,
        specifications: demand.product.specifications,
      },
      requestedQuantity: demand.requestedQuantity,
      requestedDeliveryDate: demand.requestedDeliveryDate,
      status: demand.status,
      rejectReason: demand.rejectReason,
      createdAt: demand.createdAt ?? new Date(),
      updatedAt: demand.updatedAt ?? new Date(),
    };
  }
}
