import { ProcurementContractService } from "../../../infrastructure/blockchain/services/procurement-contract.service";
import { ContractMapper } from "../../../infrastructure/persistence/mappers/contract.mapper";
import { ContractRepository } from "../../repositories/contract.repo";

type FinishUseCaseRepos = {
  contractRepo: ContractRepository;
};

type FinishUseCaseServices = {
  procurementContractService: ProcurementContractService;
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

    return ContractMapper.toDto(updatedContract);
  }
}
