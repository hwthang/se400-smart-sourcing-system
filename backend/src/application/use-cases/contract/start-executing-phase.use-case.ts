import { BlockchainTransaction } from "../../../domain/entities/blockchain-transaction.entity";
import { ProcurementContractService } from "../../../infrastructure/blockchain/services/procurement-contract.service";
import { ContractMapper } from "../../../infrastructure/persistence/mappers/contract.mapper";
import { BlockchainTransactionRepository } from "../../repositories/blockchain-transaction.repo";
import { ContractRepository } from "../../repositories/contract.repo";

type StartExecutingPhaseUseCaseRepos = {
  contractRepo: ContractRepository;
  transactionRepo: BlockchainTransactionRepository;
};

type StartExecutingPhaseUseCaseInput = {
  txHash: string;
  contractAddress: string;
};

export class StartExecutingPhaseUseCase {
  constructor(private readonly repos: StartExecutingPhaseUseCaseRepos) {}

  async execute(input: StartExecutingPhaseUseCaseInput) {
    const decoder = ProcurementContractService.create(input.contractAddress);

    const data = await decoder.decodeTransaction(input.txHash);

    if (!data.status) throw new Error();

    const contract = await this.repos.contractRepo.findByAddress(
      input.contractAddress,
    );
    if (!contract) throw new Error();

    contract.execute();

    const updatedContract = await this.repos.contractRepo.save(contract);

    const transaction = BlockchainTransaction.create({
      txHash: input.txHash,
      contractAddress: input.contractAddress,
      method: "START_EXECUTING",
      status: data?.status == 1 ? "CONFIRMED" : "FAILED",
    });
    await this.repos.transactionRepo.create(transaction);

    return ContractMapper.toDto(updatedContract);
  }
}
