import { SupplierQuotation } from "../../../domain/entities/supplier-quotation.entity";
import { SupplierRegistration } from "../../../domain/entities/supplier-registration.entity";
import { SupplierQuotationStatus } from "../../../domain/enums/supplier-quotation-status.enum";
import { SupplierRegistrationStatus } from "../../../domain/enums/supplier-registration-status.enum";
import { ProcurementContractService } from "../../../infrastructure/blockchain/services/procurement-contract.service";
import { ContractMapper } from "../../../infrastructure/persistence/mappers/contract.mapper";
import { AuthUser } from "../../common/auth-user";
import { ContractRepository } from "../../repositories/contract.repo";
import { SupplierQuotationRepository } from "../../repositories/supplier-quotation.repo";
import { SupplierRegistrationRepository } from "../../repositories/supplier-registration.repo";

type ConfirmSupplierQuotationUseCaseRepos = {
  contractRepo: ContractRepository;
  registrationRepo: SupplierRegistrationRepository;
  quotationRepo: SupplierQuotationRepository;
};

type ConfirmSupplierQuotationUseCaseInput = {
  authUser: AuthUser;
  txHash: string;
  contractAddress: string;
};

export class ConfirmSupplierQuotationUseCase {
  constructor(private readonly repos: ConfirmSupplierQuotationUseCaseRepos) {}

  async execute(input: ConfirmSupplierQuotationUseCaseInput) {
    const decoder = ProcurementContractService.create(input.contractAddress);

    const data = await decoder.decodeTransaction(input.txHash);

    if (!data.status) throw new Error();

    const contract = await this.repos.contractRepo.findByAddress(
      input.contractAddress,
    );
    if (!contract) throw new Error();

    const registration =
      await this.repos.registrationRepo.findBySupplierIdAndContractId(
        input.authUser.id,
        contract.id!,
      );
    if (!registration) throw new Error();

    const quotation = await this.repos.quotationRepo.findByRegistrationId(
      registration.id!,
    );

    if (!quotation) throw new Error();

    quotation.markConfirmed();

    await this.repos.quotationRepo.save(quotation);

    const allQuotations =
      await this.repos.quotationRepo.findAllQuotationsOfContract(contract.id!);

    const confirmedQuotations = allQuotations.filter(
      (item) => item.status == SupplierQuotationStatus.CONFIRMED,
    );

    if (confirmedQuotations.length == allQuotations.length) {
      contract.markQuotationsConfirmed();
    }

    const updatedContract = await this.repos.contractRepo.save(contract);

    return ContractMapper.toDto(updatedContract);
  }
}
