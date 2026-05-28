import mongoose, { Schema, Document, Model, SchemaType } from "mongoose";
import { DemandStatus } from "../../../domain/enums/demand-status.enum";

export interface DemandDocument extends Document {
  customerId: mongoose.Types.ObjectId;
  assignedEmployeeId: mongoose.Types.ObjectId;
  product: {
    sku: string;
    name: string;
    description: string;
    specifications: Record<string, string>;
  };
  requestedQuantity: number;
  requestedDeliveryDate: Date;
  status: DemandStatus;
  rejectReason: string;
  createdAt: Date;
  updatedAt: Date;
}

const DemandSchema = new Schema<DemandDocument>(
  {
    customerId: {
      type: Schema.Types.ObjectId, // ← Sửa từ Schema.ObjectId thành Schema.Types.ObjectId
      ref: "User", // ← Thêm ref để populate
      required: true,
    },
    assignedEmployeeId: {
      type: Schema.Types.ObjectId, // ← Sửa từ String thành ObjectId
      ref: "User", // ← Thêm ref để populate
      default: null, // ← Dùng null thay vì empty string
    },
    product: {
      sku: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      specifications: {
        type: Map,
        of: Schema.Types.Mixed,
        default: {},
      },
    },
    requestedQuantity: {
      type: Number,
      required: true,
      min: 1,
    },
    requestedDeliveryDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(DemandStatus),
      default: DemandStatus.CREATED,
      required: true,
    },
    rejectReason: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const DemandModel = mongoose.model<DemandDocument>("Demand", DemandSchema);

export default DemandModel;
