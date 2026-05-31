import {
  Document,
  HydratedDocument,
  Schema,
  model,
} from "mongoose";

export interface BlockchainTransactionDocument extends Document {
  txHash: string;

  contractAddress: string;

  method: string;

  status:
    | "PENDING"
    | "CONFIRMED"
    | "FAILED";

  createdAt: Date;

  updatedAt: Date;
}

export type BlockchainTransactionMongoDocument =
  HydratedDocument<BlockchainTransactionDocument>;

const schema =
  new Schema<BlockchainTransactionDocument>(
    {
      txHash: {
        type: String,
        required: true,
        unique: true,
        index: true,
      },

      contractAddress: {
        type: String,
        required: true,
        index: true,
      },

      method: {
        type: String,
        required: true,
      },

      status: {
        type: String,
        enum: [
          "PENDING",
          "CONFIRMED",
          "FAILED",
        ],
        default: "PENDING",
      },
    },
    {
      timestamps: true,
    },
  );

export const BlockchainTransactionModel =
  model<BlockchainTransactionDocument>(
    "BlockchainTransaction",
    schema,
  );