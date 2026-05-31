import { Types } from "mongoose";

import { BlockchainTransactionDocument } from "../schemas/blockchain-transaction.schema";

import { BlockchainTransaction } from "../../../domain/entities/blockchain-transaction.entity";
import { BlockchainTransactionDto } from "../../../application/dtos/blockchain-transaction/blockchain-transaction.dto";


export class BlockchainTransactionMapper {
  static toDomain(
    document: BlockchainTransactionDocument,
  ): BlockchainTransaction {
    return new BlockchainTransaction(
      document._id.toString(),
      document.txHash,
      document.contractAddress,
      document.method,
      document.status,
      document.createdAt,
      document.updatedAt,
    );
  }

  static toPersistence(
    entity: BlockchainTransaction,
  ) {
    return {
      ...(entity.id && {
        _id: new Types.ObjectId(
          entity.id,
        ),
      }),

      txHash: entity.txHash,

      contractAddress:
        entity.contractAddress,

      method: entity.method,

      status: entity.status,
    };
  }

  static toDto(
    entity: BlockchainTransaction,
  ): BlockchainTransactionDto {
    return {
      id: entity.id,

      txHash: entity.txHash,

      contractAddress:
        entity.contractAddress,

      method: entity.method,

      status: entity.status,

      createdAt: entity.createdAt,

      updatedAt: entity.updatedAt,
    };
  }

  static toDtos(
    entities: BlockchainTransaction[],
  ): BlockchainTransactionDto[] {
    return entities.map((entity) =>
      this.toDto(entity),
    );
  }
}