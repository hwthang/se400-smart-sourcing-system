// =========================================================
// APPLICATION LAYER: REPOSITORY INTERFACE
// =========================================================
// File: application/repositories/supplier-quotation.repo.ts

import { SupplierQuotation } from "../../domain/entities/supplier-quotation.entity";
import { SupplierQuotationStatus } from "../../domain/enums/supplier-quotation-status.enum";

export interface SupplierQuotationQuery {
  registrationId?: string;
  statuses?: SupplierQuotationStatus[];
  minUnitPrice?: number;
  maxUnitPrice?: number;
  minLeadTimeDays?: number;
  maxLeadTimeDays?: number;
  page: number;
  limit: number;
}

export interface SupplierQuotationSearchResult {
  items: SupplierQuotation[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SupplierQuotationRepository {
  save(quotation: SupplierQuotation): Promise<SupplierQuotation>;
  findById(id: string): Promise<SupplierQuotation | null>;
  findByRegistrationId(registrationId: string): Promise<SupplierQuotation | null>;
  findAllQuotationsOfContract(contractId: string): Promise<SupplierQuotation[]>;
  findMany(params: SupplierQuotationQuery): Promise<SupplierQuotationSearchResult>;
}