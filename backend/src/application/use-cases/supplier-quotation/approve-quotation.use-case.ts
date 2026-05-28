// approve-quotation.use-case.ts

import { AppError } from "../../../presentation/errors/app.error";

import { AuthUser } from "../../common/auth-user";

import { ContractRepository } from "../../repositories/contract.repo";
import { DemandRepository } from "../../repositories/demand.repo";
import { SupplierQuotationRepository } from "../../repositories/supplier-quotation.repo";
import { SupplierRegistrationRepository } from "../../repositories/supplier-registration.repo";

type ApproveDemandUseCaseRepos = {
  quotationRepo: SupplierQuotationRepository;
  registrationRepo: SupplierRegistrationRepository;
  contractRepo: ContractRepository;
  demandRepo: DemandRepository;
};

type ApproveQuotationInput = {
  quotationId: string;
  authUser: AuthUser;
};

export class ApproveQuotationUseCase {
  constructor(
    private readonly repos: ApproveDemandUseCaseRepos,
  ) {}

  async execute(
    input: ApproveQuotationInput,
  ) {
    const quotation =
      await this.repos.quotationRepo.findById(
        input.quotationId,
      );

    if (!quotation) {
      throw new AppError(
        "Quotation not found",
        404,
      );
    }

    const registration =
      await this.repos.registrationRepo.findById(
        quotation.registrationId,
      );

    if (!registration) {
      throw new AppError(
        "Supplier registration not found",
        404,
      );
    }

    const contract =
      await this.repos.contractRepo.findById(
        registration.contractId,
      );

    if (!contract) {
      throw new AppError(
        "Contract not found",
        404,
      );
    }

    const demand =
      await this.repos.demandRepo.findById(
        contract.demandId,
      );

    if (!demand) {
      throw new AppError(
        "Demand not found",
        404,
      );
    }

    if (
      demand.assignedEmployeeId !==
      input.authUser.id
    ) {
      throw new AppError(
        "Forbidden",
        403,
      );
    }

    try {
      quotation.approve();

      await this.repos.quotationRepo.save(
        quotation,
      );

      return quotation;
    } catch (error) {
      if (error instanceof Error) {
        throw new AppError(
          error.message,
          400,
        );
      }

      throw new AppError(
        "Failed to approve quotation",
      );
    }
  }
}