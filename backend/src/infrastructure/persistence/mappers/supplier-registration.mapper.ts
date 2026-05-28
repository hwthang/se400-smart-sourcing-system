import mongoose from "mongoose";
import { SupplierRegistrationDto } from "../../../application/dtos/supplier-registration/supplier-registration.dto";
import { SupplierRegistration } from "../../../domain/entities/supplier-registration.entity";
import { SupplierRegistrationDocument } from "../schemas/supplier-registration.schema";

export class SupplierRegistrationMapper {
  // Entity -> DTO
  static toDto(registration: SupplierRegistration): SupplierRegistrationDto {
    return {
      id: registration.id ?? "",
      supplierId: registration.supplierId,
      contractId: registration.contractId,
      status: registration.status,
      cancelReason: registration.cancelReason,
      createdAt: registration.createdAt ?? new Date(),
      updatedAt: registration.updatedAt ?? new Date(),
    };
  }

  // Entity -> Persistence (MongoDB)
  static toPersistence(
    registration: SupplierRegistration,
  ): Partial<SupplierRegistrationDocument> {
    return {
      supplierId: new mongoose.Types.ObjectId(registration.supplierId),
      contractId: new mongoose.Types.ObjectId(registration.contractId),
      status: registration.status,
      cancelReason: registration.cancelReason,
    };
  }

  // Persistence (MongoDB) -> Entity
  static toDomain(
    document: SupplierRegistrationDocument,
  ): SupplierRegistration {
    return new SupplierRegistration({
      id: document._id.toString(),
      supplierId: document.supplierId.toString(),
      contractId: document.contractId.toString(),
      status: document.status,
      cancelReason: document.cancelReason,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    });
  }
}
