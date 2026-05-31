import { BlockchainTransaction } from "../../../domain/entities/blockchain-transaction.entity";
import { ProcurementContractService } from "../../../infrastructure/blockchain/services/procurement-contract.service";
import { ContractMapper } from "../../../infrastructure/persistence/mappers/contract.mapper";
import { BlockchainTransactionRepository } from "../../repositories/blockchain-transaction.repo";
import { ContractRepository } from "../../repositories/contract.repo";

type FinishUseCaseRepos = {
  contractRepo: ContractRepository;
  transactionRepo: BlockchainTransactionRepository;
};

type FinishUseCaseInput = {
  txHash: string;
  contractAddress: string;
};

export class FinishUseCase {
  constructor(private readonly repos: FinishUseCaseRepos) {}

  async execute(input: FinishUseCaseInput) {
    const decoder = ProcurementContractService.create(input.contractAddress);

    const data = await decoder.decodeTransaction(input.txHash);

    if (!data.status) throw new Error();

    const contract = await this.repos.contractRepo.findByAddress(
      input.contractAddress,
    );
    if (!contract) throw new Error();

    contract.markCompleted();

    const updatedContract = await this.repos.contractRepo.save(contract);
    const transaction = BlockchainTransaction.create({
      txHash: input.txHash,
      contractAddress: input.contractAddress,
      method: "FINISH_CONTRACT",
      status: data?.status == 1 ? "CONFIRMED" : "FAILED",
    });
    await this.repos.transactionRepo.create(transaction);

    return ContractMapper.toDto(updatedContract);
  }
}
