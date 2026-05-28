// =========================================================
// APPLICATION LAYER: SUPPLIER QUOTATION DTO
// =========================================================

import { SupplierQuotationStatus } from "../../../domain/enums/supplier-quotation-status.enum";

/**
 * @title SupplierQuotationDto
 * @notice Client-facing representation with serialized timestamps (ISO strings)
 * @dev Guarantees id presence (unlike domain entity) for reliable API responses
 */
export interface SupplierQuotationDto {
  // IDENTIFIERS
  id: string; // Guaranteed non-optional for client consumption
  registrationId: string; // Links to parent procurement registration

  // COMMERCIAL TERMS
  unitPrice: number; // Price per unit in fiat currency
  maxLeadTimeDays: number; // Maximum delivery lead time promised (days)
  maxDefectRate: number; // Maximum defect rate guaranteed (0-100%)

  // CAPACITY CONSTRAINTS
  minSupplyQuantity: number; // Minimum quantity supplier can provide
  maxSupplyQuantity: number; // Maximum capacity supplier can provide

  // WORKFLOW STATE
  status: SupplierQuotationStatus; // CREATED, APPROVED, REJECTED
  rejectReason: string; // Business justification when status = REJECTED

  // AUDIT TIMESTAMPS
  createdAt: Date; // Submission timestamp
  updatedAt: Date; // Last modification timestamp
}
