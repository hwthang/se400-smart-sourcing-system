import {
  BlockchainTransaction,
  BlockchainTransactionStatus,
} from "../../domain/entities/blockchain-transaction.entity";

export interface BlockchainTransactionRepository {
  create(transaction: BlockchainTransaction): Promise<BlockchainTransaction>;

  updateStatus(
    txHash: string,
    status: BlockchainTransactionStatus,
  ): Promise<void>;

  findByTxHash(txHash: string): Promise<BlockchainTransaction | null>;

  findByContractAddress(
    contractAddress: string,
  ): Promise<BlockchainTransaction[]>;
}
