import { ProcurementContractService } from "../../../infrastructure/blockchain/services/procurement-contract.service";
import { ContractMapper } from "../../../infrastructure/persistence/mappers/contract.mapper";
import { ContractRepository } from "../../repositories/contract.repo";

type DepositUseCaseRepos = {
  contractRepo: ContractRepository;
};

type DepositUseCaseInput = {
  txHash: string;
  contractAddress: string;
};

export class DepositUseCase {
  constructor(private readonly repos: DepositUseCaseRepos) {}

  async execute(input: DepositUseCaseInput) {
    const decoder = ProcurementContractService.create(input.contractAddress);

    const data = await decoder.decodeTransaction(input.txHash);

    if (!data.status) throw new Error();

    const contract = await this.repos.contractRepo.findByAddress(
      input.contractAddress,
    );
    if (!contract) throw new Error();
    
    contract.markFunded();

    const updatedContract = await this.repos.contractRepo.save(contract);

    return ContractMapper.toDto(updatedContract);
  }
}
