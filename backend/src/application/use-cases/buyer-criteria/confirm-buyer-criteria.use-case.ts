import { BuyerCriteria } from "../../../domain/entities/buyer-criteria.entity";
import { BuyerCriteriaStatus } from "../../../domain/enums/buyer-criteria-status.enum";
import { SupplierQuotationStatus } from "../../../domain/enums/supplier-quotation-status.enum";
import { SupplierRegistrationStatus } from "../../../domain/enums/supplier-registration-status.enum";
import { ProcurementContractService } from "../../../infrastructure/blockchain/services/procurement-contract.service";
import { ContractMapper } from "../../../infrastructure/persistence/mappers/contract.mapper";
import { BuyerCriteriaRepository } from "../../repositories/buyer-criteria.repo";
import { ContractRepository } from "../../repositories/contract.repo";
import { SupplierRegistrationRepository } from "../../repositories/supplier-registration.repo";
import { UserRepository } from "../../repositories/user.repo";

type ConfirmBuyerCriteriaUseCaseRepos = {
  contractRepo: ContractRepository;
  registrationRepo: SupplierRegistrationRepository;
  criteriaRepo: BuyerCriteriaRepository;
  userRepo: UserRepository;
};

type ConfirmBuyerCriteriaUseCaseInput = {
  txHash: string;
  contractAddress: string;
};

export class ConfirmBuyerCriteriaUseCase {
  constructor(private readonly repos: ConfirmBuyerCriteriaUseCaseRepos) {}

  async execute(input: ConfirmBuyerCriteriaUseCaseInput) {
    const decoder = ProcurementContractService.create(input.contractAddress);

    const data = await decoder.decodeTransaction(input.txHash);

    if (!data.status) throw new Error();

    const supplierAddress = data.input.args[0];

    const supplier =
      await this.repos.userRepo.findByWalletAddress(supplierAddress);

    if (!supplier) throw new Error();

    const contract = await this.repos.contractRepo.findByAddress(
      input.contractAddress,
    );

    if (!contract) throw new Error();

    const registration =
      await this.repos.registrationRepo.findBySupplierIdAndContractId(
        supplier.id!,
        contract.id!,
      );
    if (!registration) throw new Error();

    const criteria = await this.repos.criteriaRepo.findByRegistrationId(
      registration.id!,
    );

    if (!criteria) throw new Error();

    criteria.confirm();

    await this.repos.criteriaRepo.save(criteria);

    const allCriteria = await this.repos.criteriaRepo.findAllCriteriaOfContract(
      contract.id!,
    );

    const confirmedCriteria = allCriteria.filter(
      (item) => item.status == BuyerCriteriaStatus.CONFIRMED,
    );

    
    const allRegistrations = await this.repos.registrationRepo.findAllByContractId(
      contract.id!,
    );

    const confirmedRegistrations = allRegistrations.filter(
      (item) => item.status == SupplierRegistrationStatus.CONFIRMED,
    );

    if (confirmedCriteria.length == confirmedRegistrations.length) {
      contract.markCriteriaSet();
    }

    const updatedContract = await this.repos.contractRepo.save(contract);

    return ContractMapper.toDto(updatedContract);
  }
}
