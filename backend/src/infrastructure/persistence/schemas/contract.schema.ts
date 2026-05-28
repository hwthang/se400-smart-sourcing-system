// contract.schema.ts
import mongoose, { Schema, Document, Model } from "mongoose";
import { ContractStatus } from "../../../domain/enums/contract-status.enum";

export interface ContractDocument extends Document {
  demandId: mongoose.Types.ObjectId;
  externalId: string;
  address: string;
  evaluationWeights: {
    price: number;
    leadTime: number;
    defect: number;
  };
  penaltyRates: {
    delay: number;
    defect: number;
  };
  requiredDepositedAmount: number;
  status: ContractStatus;
  createdAt: Date;
  updatedAt: Date;
}

const ContractSchema = new Schema<ContractDocument>(
  {
    demandId: {
      type: Schema.Types.ObjectId,
      ref: "Demand",
      required: true,
    },
    externalId: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    evaluationWeights: {
      price: {
        type: Number,
        default: 0,
      },
      leadTime: {
        type: Number,
        default: 0,
      },
      defect: {
        type: Number,
        default: 0,
      },
    },
    penaltyRates: {
      delay: {
        type: Number,
        default: 0,
      },
      defect: {
        type: Number,
        required: true,
        default: 0,
      },
    },
    requiredDepositedAmount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: Object.values(ContractStatus),
      default: ContractStatus.CREATED,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const ContractModel = mongoose.model<ContractDocument>(
  "Contract",
  ContractSchema,
);

export default ContractModel;
