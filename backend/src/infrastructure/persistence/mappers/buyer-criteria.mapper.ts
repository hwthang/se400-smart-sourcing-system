// src/infrastructure/mappers/buyer-criteria.mapper.ts
import { BuyerCriteria } from "../../../domain/entities/buyer-criteria.entity";
import { BuyerCriteriaDocument } from "../schemas/buyer-criteria.schema";
import { BuyerCriteriaDto } from "../../../application/dtos/buyer-criteria/buyer-criteria.dto";

export class BuyerCriteriaMapper {
  // A. DOMAIN ENTITY ➡️ DATABASE DOCUMENT
  // Rule: Invokes the Entity's property getters
  public static toPersistence(
    entity: BuyerCriteria,
  ): Partial<BuyerCriteriaDocument> {
    return {
      registrationId: entity.registrationId,
      minPurchaseQuantity: entity.minPurchaseQuantity,
      maxAllocationPercent: entity.maxAllocationPercent,
      status: entity.status,
    };
  }

  // B. DATABASE DOCUMENT ➡️ DOMAIN ENTITY
  // Rule: Re-instantiates internal structures via constructor
  public static toDomain(doc: BuyerCriteriaDocument): BuyerCriteria {
    return new BuyerCriteria({
      id: doc._id.toString(),
      registrationId: doc.registrationId,
      minPurchaseQuantity: doc.minPurchaseQuantity,
      maxAllocationPercent: doc.maxAllocationPercent,
      status: doc.status,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  // C. DOMAIN ENTITY ➡️ CLEAN DTO
  // Rule: Applies fallback values to satisfy strict API contract types
  public static toDto(entity: BuyerCriteria): BuyerCriteriaDto {
    return {
      id: entity.id ?? "", // Fallback applied safely
      registrationId: entity.registrationId,
      minPurchaseQuantity: entity.minPurchaseQuantity,
      maxAllocationPercent: entity.maxAllocationPercent,
      status: entity.status,
      createdAt: entity.createdAt ?? new Date(),
      updatedAt: entity.updatedAt ?? new Date(),
    };
  }
}
