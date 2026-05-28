// update-criteria.use-case.ts

import { AppError } from "../../../presentation/errors/app.error";

import { AuthUser } from "../../common/auth-user";

import { BuyerCriteriaRepository } from "../../repositories/buyer-criteria.repo";
import { ContractRepository } from "../../repositories/contract.repo";
import { DemandRepository } from "../../repositories/demand.repo";
import { SupplierRegistrationRepository } from "../../repositories/supplier-registration.repo";

type UpdateCriteriaUseCaseRepos = {
  criteriaRepo: BuyerCriteriaRepository;
  registrationRepo: SupplierRegistrationRepository;
  contractRepo: ContractRepository;
  demandRepo: DemandRepository;
};

type UpdateCriteriaInput = {
  criteriaId: string;

  minPurchaseQuantity: number;
  maxAllocationPercent: number;

  authUser: AuthUser;
};

export class UpdateCriteriaUseCase {
  constructor(
    private readonly repos: UpdateCriteriaUseCaseRepos,
  ) {}

  async execute(
    input: UpdateCriteriaInput,
  ) {
    const criteria =
      await this.repos.criteriaRepo.findById(
        input.criteriaId,
      );

    if (!criteria) {
      throw new AppError(
        "Buyer criteria not found",
        404,
      );
    }

    const registration =
      await this.repos.registrationRepo.findById(
        criteria.registrationId,
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
      criteria.update({
        minPurchaseQuantity:
          input.minPurchaseQuantity,

        maxAllocationPercent:
          input.maxAllocationPercent,
      });

      await this.repos.criteriaRepo.save(
        criteria,
      );

      return criteria;
    } catch (error) {
      if (error instanceof Error) {
        throw new AppError(
          error.message,
          400,
        );
      }

      throw new AppError(
        "Failed to update buyer criteria",
      );
    }
  }
}