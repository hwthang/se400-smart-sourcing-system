import { ProcurementContractService } from "../../../infrastructure/blockchain/services/procurement-contract.service";
import { ContractMapper } from "../../../infrastructure/persistence/mappers/contract.mapper";
import { DemandMapper } from "../../../infrastructure/persistence/mappers/demand.mapper";
import { ContractRepository } from "../../repositories/contract.repo";
import { DemandRepository } from "../../repositories/demand.repo";

type ConfirmDemandUseCaseRepos = {
  contractRepo: ContractRepository;
  demandRepo: DemandRepository;
};

type ConfirmDemandUseCaseInput = {
  id: string;
  txHash: string;
  contractAddress: string;
};

export class ConfirmDemandUseCase {
  constructor(private readonly repos: ConfirmDemandUseCaseRepos) {}

  async execute(input: ConfirmDemandUseCaseInput) {
    const demand = await this.repos.demandRepo.findById(input.id);

    if (!demand) throw new Error();

    demand.confirm();
    const decoder = ProcurementContractService.create(input.contractAddress);

    const data = await decoder.decodeTransaction(input.txHash);

    if (!data.status) throw new Error();

    const contract = await this.repos.contractRepo.findByAddress(
      input.contractAddress,
    );
    if (!contract) throw new Error();

    contract.markDemandConfirmed();

    await this.repos.demandRepo.save(demand);
    await this.repos.contractRepo.save(contract);

    return DemandMapper.toDto(demand);
  }
}
