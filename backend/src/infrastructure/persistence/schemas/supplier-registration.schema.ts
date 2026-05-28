import mongoose, { Schema, Document, Types } from "mongoose";
import { SupplierRegistrationStatus } from "../../../domain/enums/supplier-registration-status.enum";

export interface SupplierRegistrationDocument extends Document {
  supplierId: Types.ObjectId;
  contractId: Types.ObjectId;
  status: SupplierRegistrationStatus;
  cancelReason: string;
  createdAt: Date;
  updatedAt: Date;
}

const SupplierRegistrationSchema = new Schema<SupplierRegistrationDocument>(
  {
    supplierId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    contractId: {
      type: Schema.Types.ObjectId,
      ref: "Contract",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(SupplierRegistrationStatus),
      default: SupplierRegistrationStatus.CREATED,
      required: true,
      index: true,
    },
    cancelReason: {
      type: String,
      default: "",
      required: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const SupplierRegistrationModel = mongoose.model<SupplierRegistrationDocument>(
  "SupplierRegistration",
  SupplierRegistrationSchema,
);

export default SupplierRegistrationModel;