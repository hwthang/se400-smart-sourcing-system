// =========================================================
// INFRASTRUCTURE LAYER: SUPPLIER QUOTATION MAPPER
// =========================================================

import { SupplierQuotation } from "../../../domain/entities/supplier-quotation.entity";
import { SupplierQuotationDocument } from "../schemas/supplier-quotation.schema";
import { SupplierQuotationDto } from "../../../application/dtos/supplier-quotation/supplier-quotation.dto";

export class SupplierQuotationMapper {
  // =========================================================
  // DOMAIN → DATABASE (Write path)
  // =========================================================

  public static toPersistence(
    entity: SupplierQuotation,
  ): Partial<SupplierQuotationDocument> {
    return {
      registrationId: entity.registrationId,
      unitPrice: entity.unitPrice,
      maxLeadTimeDays: entity.maxLeadTimeDays,
      maxDefectRate: entity.maxDefectRate,
      minSupplyQuantity: entity.minSupplyQuantity,
      maxSupplyQuantity: entity.maxSupplyQuantity,
      status: entity.status,
      rejectReason: entity.rejectReason,
    };
  }

  // =========================================================
  // DATABASE → DOMAIN (Read path)
  // =========================================================

  public static toDomain(doc: SupplierQuotationDocument): SupplierQuotation {
    return new SupplierQuotation({
      id: doc._id.toString(),
      registrationId: doc.registrationId,
      unitPrice: doc.unitPrice,
      maxLeadTimeDays: doc.maxLeadTimeDays,
      maxDefectRate: doc.maxDefectRate,
      minSupplyQuantity: doc.minSupplyQuantity,
      maxSupplyQuantity: doc.maxSupplyQuantity,
      status: doc.status,
      rejectReason: doc.rejectReason,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  // =========================================================
  // DOMAIN → API DTO (Client response)
  // Fallback strategy: empty string for missing ID, current date for missing timestamps
  // =========================================================

  public static toDto(entity: SupplierQuotation): SupplierQuotationDto {
    return {
      id: entity.id ?? "",
      registrationId: entity.registrationId,
      unitPrice: entity.unitPrice,
      maxLeadTimeDays: entity.maxLeadTimeDays,
      maxDefectRate: entity.maxDefectRate,
      minSupplyQuantity: entity.minSupplyQuantity,
      maxSupplyQuantity: entity.maxSupplyQuantity,
      status: entity.status,
      rejectReason: entity.rejectReason,
      createdAt: entity.createdAt ?? new Date(),
      updatedAt: entity.updatedAt ?? new Date(),
    };
  }
}
