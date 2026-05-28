import { SupplierRegistration } from "../../../domain/entities/supplier-registration.entity";
import { UserRole } from "../../../domain/enums/user-role.enum";
import { SupplierRegistrationStatus } from "../../../domain/enums/supplier-registration-status.enum";
import { ContractStatus } from "../../../domain/enums/contract-status.enum";
import { SupplierRegistrationMapper } from "../../../infrastructure/persistence/mappers/supplier-registration.mapper";
import { AppError } from "../../../presentation/errors/app.error";
import { AuthUser } from "../../common/auth-user";
import { SupplierRegistrationRepository } from "../../repositories/supplier-registration.repo";
import { ContractRepository } from "../../repositories/contract.repo";
import { DemandRepository } from "../../repositories/demand.repo";

type CancelRegistrationRepos = {
  registrationRepo: SupplierRegistrationRepository;
  contractRepo: ContractRepository;
  demandRepo: DemandRepository;
};

type CancelRegistrationUseCaseInput = {
  authUser: AuthUser;
  registrationId: string;
  reason: string;
};

export class CancelRegistrationUseCase {
  constructor(
    private readonly repos: CancelRegistrationRepos,
  ) {}

  async execute(input: CancelRegistrationUseCaseInput) {
    try {
      // 1. Find registration
      const registration = await this.repos.registrationRepo.findById(input.registrationId);
      if (!registration) {
        throw new AppError("Supplier registration not found", 404);
      }

      // 2. Find contract (fetch once, reuse)
      const contract = await this.repos.contractRepo.findById(registration.contractId);
      if (!contract) {
        throw new AppError("Contract not found", 404);
      }

      // 3. Check permission based on user role
      if (input.authUser.role === UserRole.EMPLOYEE) {
        // Employee: check assignedEmployeeId from demand
        const demand = await this.repos.demandRepo.findById(contract.demandId);
        if (!demand) {
          throw new AppError("Demand not found", 404);
        }

        if (demand.assignedEmployeeId !== input.authUser.id) {
          throw new AppError(
            "You are not assigned to this demand. Only the assigned employee can cancel registrations.",
            403,
          );
        }
      } 
      else if (input.authUser.role === UserRole.SUPPLIER) {
        // Supplier: check supplierId from registration
        if (registration.supplierId !== input.authUser.id) {
          throw new AppError(
            "You don't have permission to cancel this registration",
            403,
          );
        }
      } 
      else {
        // Other roles (MANAGER, etc.) - no permission
        throw new AppError(
          "You don't have permission to cancel this registration",
          403,
        );
      }

      // 4. Validate cancellation reason
      if (!input.reason || input.reason.trim() === "") {
        throw new AppError("Cancellation reason is required", 400);
      }

      // 5. Check if contract is still open for registration
      if (contract.status !== ContractStatus.SUPPLIER_REGISTRATION_OPENED) {
        throw new AppError(
          `Cannot cancel registration because contract is in ${contract.status} status. Registration can only be cancelled when contract is open for registration.`,
          400,
        );
      }

      // 6. Check if registration can be cancelled (only CREATED status)
      if (registration.status !== SupplierRegistrationStatus.CREATED) {
        throw new AppError(
          `Cannot cancel registration in ${registration.status} status. Only pending registrations can be cancelled.`,
          400,
        );
      }

      // 7. Cancel registration
      registration.cancel(input.reason);
      const updatedRegistration = await this.repos.registrationRepo.save(registration);

      return SupplierRegistrationMapper.toDto(updatedRegistration);
    } catch (error) {
      console.error("CancelRegistrationUseCase error:", error);

      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        error instanceof Error
          ? error.message
          : "Failed to cancel supplier registration",
        500,
      );
    }
  }
}