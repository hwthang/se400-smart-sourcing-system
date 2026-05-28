// src/infrastructure/schemas/buyer-criteria.schema.ts
import mongoose, { Schema, Document } from "mongoose";
import { BuyerCriteriaStatus } from "../../../domain/enums/buyer-criteria-status.enum";

export interface BuyerCriteriaDocument extends Document {
  registrationId: string;
  minPurchaseQuantity: number;
  maxAllocationPercent: number;
  status: BuyerCriteriaStatus;
  createdAt: Date;
  updatedAt: Date;
}

const BuyerCriteriaSchema = new Schema<BuyerCriteriaDocument>(
  {
    registrationId: { type: String, required: true, index: true },
    minPurchaseQuantity: { type: Number, required: true, min: 1 },
    maxAllocationPercent: { type: Number, required: true, min: 1, max: 10000 },
    status: {
      type: String,
      enum: Object.values(BuyerCriteriaStatus),
      default: BuyerCriteriaStatus.CREATED,
      required: true
    }
  },
  {
    timestamps: true, // Auto-manage createdAt and updatedAt
    versionKey: false,
  }
);

// Compound index for efficient queries
BuyerCriteriaSchema.index({ registrationId: 1, status: 1 });

export const BuyerCriteriaModel = mongoose.model<BuyerCriteriaDocument>("BuyerCriteria", BuyerCriteriaSchema);