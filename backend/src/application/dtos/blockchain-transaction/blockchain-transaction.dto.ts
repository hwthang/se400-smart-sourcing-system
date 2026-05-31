export interface BlockchainTransactionDto {
  id?: string;

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