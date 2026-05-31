import { BlockchainTransaction } from "../../../domain/entities/blockchain-transaction.entity";
import { BlockchainTransactionRepository } from "../../../application/repositories/blockchain-transaction.repo";

import { BlockchainTransactionModel } from "../schemas/blockchain-transaction.schema";
import { BlockchainTransactionMapper } from "../mappers/blockchain-transaction.mapper";

export class MongoBlockchainTransactionRepository
  implements BlockchainTransactionRepository
{
  async create(
    transaction: BlockchainTransaction,
  ): Promise<BlockchainTransaction> {
    const document =
      await BlockchainTransactionModel.create(
        BlockchainTransactionMapper.toPersistence(
          transaction,
        ),
      );

    return BlockchainTransactionMapper.toDomain(
      document,
    );
  }

  async updateStatus(
    txHash: string,
    status:
      | "PENDING"
      | "CONFIRMED"
      | "FAILED",
  ): Promise<void> {
    await BlockchainTransactionModel.updateOne(
      { txHash },
      { status },
    );
  }

  async findByTxHash(
    txHash: string,
  ): Promise<BlockchainTransaction | null> {
    const document =
      await BlockchainTransactionModel.findOne({
        txHash,
      });

    if (!document) {
      return null;
    }

    return BlockchainTransactionMapper.toDomain(
      document,
    );
  }

  async findByContractAddress(
    contractAddress: string,
  ): Promise<BlockchainTransaction[]> {
    const documents =
      await BlockchainTransactionModel.find({
        contractAddress,
      }).sort({
        createdAt: -1,
      });

    return documents.map((document) =>
      BlockchainTransactionMapper.toDomain(
        document,
      ),
    );
  }
}