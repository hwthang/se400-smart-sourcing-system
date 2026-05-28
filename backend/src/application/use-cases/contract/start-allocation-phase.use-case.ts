import { ProcurementContractService } from "../../../infrastructure/blockchain/services/procurement-contract.service";
import { ContractMapper } from "../../../infrastructure/persistence/mappers/contract.mapper";
import { ContractRepository } from "../../repositories/contract.repo";

type StartAllocationPhaseUseCaseRepos = {
  contractRepo: ContractRepository;
};

type StartAllocationPhaseUseCaseInput = {
  txHash: string;
  contractAddress: string;
};

export class StartAllocationPhaseUseCase {
  constructor(private readonly repos: StartAllocationPhaseUseCaseRepos) {}

  async execute(input: StartAllocationPhaseUseCaseInput) {
    const decoder = ProcurementContractService.create(input.contractAddress);

    const data = await decoder.decodeTransaction(input.txHash);

    if (!data.status) throw new Error();

    const contract = await this.repos.contractRepo.findByAddress(
      input.contractAddress,
    );
    if (!contract) throw new Error();

    contract.requestCriteriaConfiguration();

    const updatedContract = await this.repos.contractRepo.save(contract);

    return ContractMapper.toDto(updatedContract);
  }
}
