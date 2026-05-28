import { Contract } from "ethers";
import { ProcurementContractService } from "../../../infrastructure/blockchain/services/procurement-contract.service";
import { ContractRepository } from "../../repositories/contract.repo";
import { ContractMapper } from "../../../infrastructure/persistence/mappers/contract.mapper";
import { DemandRepository } from "../../repositories/demand.repo";
import { SupplierQuotationRepository } from "../../repositories/supplier-quotation.repo";

type StartOrderingPhaseUseCaseRepos = {
  contractRepo: ContractRepository;
  demandRepo: DemandRepository;
  quotationRepo: SupplierQuotationRepository;
};

type StartOrderingPhaseUseCaseInput = {
  txHash: string;
  contractAddress: string;
};

export class StartOrderingPhaseUseCase {
  constructor(private readonly repos: StartOrderingPhaseUseCaseRepos) {}

  async execute(input: StartOrderingPhaseUseCaseInput) {
    const decoder = ProcurementContractService.create(input.contractAddress);

    const data = await decoder.decodeTransaction(input.txHash);

    if (!data.status) throw new Error();

    const contract = await this.repos.contractRepo.findByAddress(
      input.contractAddress,
    );
    if (!contract) throw new Error();

    contract.requestPartyConfirmation();

    const demand = await this.repos.demandRepo.findById(contract.demandId);
    if (!demand) throw new Error();

    demand.markPendingConfirmation();
    await this.repos.demandRepo.save(demand);

    const quotations =
      await this.repos.quotationRepo.findAllQuotationsOfContract(contract.id!);

    quotations.forEach((item) => item.markPendingConfirmation());

    await Promise.all(
      quotations.map((quotation) => this.repos.quotationRepo.save(quotation)),
    );

    const updatedContract = await this.repos.contractRepo.save(contract);

    return ContractMapper.toDto(updatedContract);
  }
}
