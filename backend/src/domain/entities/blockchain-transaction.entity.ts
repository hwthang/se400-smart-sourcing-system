export type BlockchainTransactionStatus =
  | "PENDING"
  | "CONFIRMED"
  | "FAILED";

export class BlockchainTransaction {
  constructor(
    public readonly id: string | undefined,
    public readonly txHash: string,
    public readonly contractAddress: string,
    public readonly method: string,
    public readonly status: BlockchainTransactionStatus,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(params: {
    txHash: string;
    contractAddress: string;
    method: string;
    status?: BlockchainTransactionStatus;
  }): BlockchainTransaction {
    const now = new Date();

    return new BlockchainTransaction(
      undefined,
      params.txHash,
      params.contractAddress,
      params.method,
      params.status ?? "PENDING",
      now,
      now,
    );
  }
}