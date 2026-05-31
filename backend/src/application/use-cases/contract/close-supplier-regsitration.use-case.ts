import { UserRole } from "../../../domain/enums/user-role.enum";
import { ContractStatus } from "../../../domain/enums/contract-status.enum";
import { ContractMapper } from "../../../infrastructure/persistence/mappers/contract.mapper";
import { AppError } from "../../../presentation/errors/app.error";
import { AuthUser } from "../../common/auth-user";
import { ContractRepository } from "../../repositories/contract.repo";
import { DemandRepository } from "../../repositories/demand.repo";
import { SupplierQuotationRepository } from "../../repositories/supplier-quotation.repo";
import { SupplierQuotationStatus } from "../../../domain/enums/supplier-quotation-status.enum";

type CloseSupplierRegistrationRepos = {
  contractRepo: ContractRepository;
  demandRepo: DemandRepository;
  quotationRepo: SupplierQuotationRepository;
};

type CloseSupplierRegistrationUseCaseInput = {
  authUser: AuthUser;
  contractId: string;
};

export class CloseSupplierRegistrationUseCase {
  constructor(private readonly repos: CloseSupplierRegistrationRepos) {}

  async execute(input: CloseSupplierRegistrationUseCaseInput) {
    try {
      if (input.authUser.role !== UserRole.EMPLOYEE) {
        throw new AppError(
          "You don't have permission to close supplier registration",
          403,
        );
      }

      const contract = await this.repos.contractRepo.findById(input.contractId);
      if (!contract) throw new AppError("Contract not found", 404);

      if (contract.status !== ContractStatus.SUPPLIER_REGISTRATION_OPENED) {
        throw new AppError(
          `Cannot close registration in ${contract.status} status`,
          400,
        );
      }

      const demand = await this.repos.demandRepo.findById(contract.demandId);
      if (!demand) throw new AppError("Demand not found", 404);

      if (demand.assignedEmployeeId !== input.authUser.id) {
        throw new AppError(
          "Only the assigned employee can close supplier registration",
          403,
        );
      }

      const quotations =
        await this.repos.quotationRepo.findAllQuotationsOfContract(
          contract.id!,
        );
      const canClose = quotations.find(
        (item) => item.status != SupplierQuotationStatus.APPROVED,
      )
        ? false
        : true;

      if (!canClose)
        throw new AppError("There are some quotations not be APPROVED", 400);

      contract.closeSupplierRegistration();
      const updatedContract = await this.repos.contractRepo.save(contract);

      return ContractMapper.toDto(updatedContract);
    } catch (error) {
      console.error("CloseSupplierRegistrationUseCase error:", error);
      if (error instanceof AppError) throw error;
      throw new AppError("Failed to close supplier registration", 500);
    }
  }
}
