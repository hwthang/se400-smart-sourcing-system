// =========================================================
// APPLICATION LAYER: REPOSITORY INTERFACE
// =========================================================
// File: application/repositories/buyer-criteria.repo.ts

import { BuyerCriteria } from "../../domain/entities/buyer-criteria.entity";
import { BuyerCriteriaStatus } from "../../domain/enums/buyer-criteria-status.enum";

export interface BuyerCriteriaQuery {
  registrationId?: string;
  statuses?: BuyerCriteriaStatus[];
  minPurchaseQuantity?: number;
  maxPurchaseQuantity?: number;
  minAllocationPercent?: number;
  maxAllocationPercent?: number;
  page: number;
  limit: number;
}

export interface BuyerCriteriaSearchResult {
  items: BuyerCriteria[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface BuyerCriteriaRepository {
  save(criteria: BuyerCriteria): Promise<BuyerCriteria>;
  findById(id: string): Promise<BuyerCriteria | null>;
  findByRegistrationId(registrationId: string): Promise<BuyerCriteria | null>;
  findAllCriteriaOfContract(contractId: string): Promise<BuyerCriteria[]>;
  findMany(params: BuyerCriteriaQuery): Promise<BuyerCriteriaSearchResult>;
}