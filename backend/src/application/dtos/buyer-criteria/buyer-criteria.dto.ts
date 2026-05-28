// src/application/dtos/buyer-criteria.dto.ts
import { BuyerCriteriaStatus } from "../../../domain/enums/buyer-criteria-status.enum";

export interface BuyerCriteriaDto {
  id: string; // Guaranteed non-optional for the client
  registrationId: string;
  minPurchaseQuantity: number;
  maxAllocationPercent: number;
  status: BuyerCriteriaStatus;
  createdAt: Date; // ISO String format preferred for APIs
  updatedAt: Date; // ISO String format preferred for APIs
}