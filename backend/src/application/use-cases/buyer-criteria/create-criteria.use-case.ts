// create-criteria.use-case.ts

import { AppError } from "../../../presentation/errors/app.error";

import { AuthUser } from "../../common/auth-user";

import { BuyerCriteria } from "../../../domain/entities/buyer-criteria.entity";

import { BuyerCriteriaRepository } from "../../repositories/buyer-criteria.repo";
import { ContractRepository } from "../../repositories/contract.repo";
import { DemandRepository } from "../../repositories/demand.repo";
import { SupplierRegistrationRepository } from "../../repositories/supplier-registration.repo";

type CreateCriteriaUseCaseRepos = {
  criteriaRepo: BuyerCriteriaRepository;
  contractRepo: ContractRepository;
  demandRepo: DemandRepository;
  registrationRepo: SupplierRegistrationRepository;
};

type CreateCriteriaInput = {
  contractId: string;
  registrationId: string;

  minPurchaseQuantity: number;
  maxAllocationPercent: number;

  authUser: AuthUser;
};

export class CreateCriteriaUseCase {
  constructor(private readonly repos: CreateCriteriaUseCaseRepos) {}

  async execute(input: CreateCriteriaInput) {

      const registration = await this.repos.registrationRepo.findById(
      input.registrationId,
    );

    if (!registration) {
      throw new AppError("Supplier registration not found", 404);
    }
    const contract = await this.repos.contractRepo.findById(registration.contractId);

    if (!contract) {
      throw new AppError("Contract not found", 404);
    }

    const demand = await this.repos.demandRepo.findById(contract.demandId);

    if (!demand) {
      throw new AppError("Demand not found", 404);
    }

    if (demand.assignedEmployeeId !== input.authUser.id) {
      throw new AppError("Forbidden", 403);
    }

  

    if (registration.contractId !== contract.id) {
      throw new AppError("Invalid registration", 400);
    }

    const existedCriteria = await this.repos.criteriaRepo.findByRegistrationId(
      registration.id!,
    );

    if (existedCriteria) {
      throw new AppError("Buyer criteria already exists", 400);
    }

    try {
      const criteria = BuyerCriteria.create({
        registrationId: registration.id!,

        minPurchaseQuantity: input.minPurchaseQuantity,

        maxAllocationPercent: input.maxAllocationPercent,
      });

      await this.repos.criteriaRepo.save(criteria);

      return criteria;
    } catch (error) {
      if (error instanceof Error) {
        throw new AppError(error.message, 400);
      }

      throw new AppError("Failed to create buyer criteria");
    }
  }
}
