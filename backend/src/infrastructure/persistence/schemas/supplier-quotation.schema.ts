// =========================================================
// INFRASTRUCTURE LAYER: SUPPLIER QUOTATION SCHEMA
// =========================================================
// Purpose: MongoDB persistence model for supplier quotations
// Maps domain SupplierQuotation entity to database collection

import mongoose, { Schema, Document } from "mongoose";
import { SupplierQuotationStatus } from "../../../domain/enums/supplier-quotation-status.enum";

// =========================================================
// DOCUMENT INTERFACE (PERSISTENCE CONTRACT)
// =========================================================

export interface SupplierQuotationDocument extends Document {
  registrationId: string; // Links to procurement registration
  unitPrice: number; // Price per unit offered
  maxLeadTimeDays: number; // Maximum delivery lead time promised
  maxDefectRate: number; // Maximum defect rate guaranteed (%)
  minSupplyQuantity: number; // Minimum quantity supplier can provide
  maxSupplyQuantity: number; // Maximum capacity supplier can provide
  status: SupplierQuotationStatus; // Lifecycle state (CREATED, APPROVED, REJECTED)
  rejectReason: string; // Business justification when status = REJECTED
  createdAt: Date;
  updatedAt: Date;
}

// =========================================================
// MONGOOSE SCHEMA DEFINITION
// =========================================================

const SupplierQuotationSchema = new Schema<SupplierQuotationDocument>(
  {
    // -------------------------
    // Business identifier
    // -------------------------
    registrationId: {
      type: String,
      required: true,
    },

    // -------------------------
    // Commercial terms
    // Business rule: unitPrice must be positive
    // -------------------------
    unitPrice: {
      type: Number,
      required: true,
      min: 0.01, // Minimum 1 cent - prevents zero or negative pricing
    },

    // -------------------------
    // Performance guarantees
    // -------------------------
    maxLeadTimeDays: {
      type: Number,
      required: true,
      min: 0, // Zero = same-day delivery
    },

    maxDefectRate: {
      type: Number,
      required: true,
      min: 0,
      max: 10000, // Percentage value (0% = perfect quality)
    },

    // -------------------------
    // Supply capacity constraints
    // Business rule: minSupplyQuantity must be <= maxSupplyQuantity (enforced at application level)
    // -------------------------
    minSupplyQuantity: {
      type: Number,
      required: true,
      min: 1, // Minimum 1 unit - prevents zero-quantity quotations
    },

    maxSupplyQuantity: {
      type: Number,
      required: true,
      min: 1,
    },

    // -------------------------
    // Workflow state
    // Default: CREATED when quotation is first submitted
    // -------------------------
    status: {
      type: String,
      enum: Object.values(SupplierQuotationStatus),
      default: SupplierQuotationStatus.CREATED,
      required: true,
    },

    // -------------------------
    // Audit fields
    // rejectReason only populated when status = REJECTED
    // -------------------------
    rejectReason: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true, // Auto-manages createdAt (submission time) and updatedAt (last status change)
    versionKey: false, // Disable __v field - not needed for this domain
  },
);

// =========================================================
// MODEL EXPORT
// =========================================================

export const SupplierQuotationModel = mongoose.model<SupplierQuotationDocument>(
  "SupplierQuotation",
  SupplierQuotationSchema,
);
