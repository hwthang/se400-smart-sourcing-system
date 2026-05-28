import { SupplierRegistration } from "../../../domain/entities/supplier-registration.entity";
import { UserRole } from "../../../domain/enums/user-role.enum";
import { SupplierRegistrationMapper } from "../../../infrastructure/persistence/mappers/supplier-registration.mapper";
import { AppError } from "../../../presentation/errors/app.error";
import { AuthUser } from "../../common/auth-user";

import { SupplierRegistrationRepository } from "../../repositories/supplier-registration.repo";
import { ContractRepository } from "../../repositories/contract.repo";
import { ContractStatus } from "../../../domain/enums/contract-status.enum";

type CreateRegistrationUseCaseRepos = {
  registrationRepo: SupplierRegistrationRepository;
  contractRepo: ContractRepository;
};

type CreateRegistrationUseCaseInput={
  authUser: AuthUser, contractId: string
}

export class CreateRegistrationUseCase {
  constructor(private readonly repos: CreateRegistrationUseCaseRepos) {}

  async execute(input:CreateRegistrationUseCaseInput) {
    try {
      // Validate user role - only suppliers can register
      console.log(input.authUser)
      if (input.authUser.role !== UserRole.SUPPLIER) {
        throw new AppError(
          "You don't have permission to create supplier registration",
          403,
        );
      }
console.log(input)
      // Validate DTO
      if (!input.contractId || input.contractId.trim() === "") {
        throw new AppError("Contract ID is required", 400);
      }

      // Check if contract exists
      const contract = await this.repos.contractRepo.findById(input.contractId);
      if (!contract) {
        throw new AppError("Contract not found", 404);
      }

      // Check if contract allows registration
      if (contract.status !== ContractStatus.SUPPLIER_REGISTRATION_OPENED) {
        throw new AppError(
          "Contract is not open for supplier registration",
          400,
        );
      }

      // Check if supplier already registered for this contract
      const existingRegistration =
        await this.repos.registrationRepo.findBySupplierIdAndContractId(
          input.authUser.id,
          input.contractId,
        );

      if (existingRegistration) {
        throw new AppError(
          "You have already registered for this contract",
          409,
        );
      }

      // Create registration entity
      const registration = SupplierRegistration.create({
        supplierId: input.authUser.id,
        contractId: input.contractId,
      });

      // Save to database
      const savedRegistration =
        await this.repos.registrationRepo.save(registration);

      return SupplierRegistrationMapper.toDto(savedRegistration);
    } catch (error) {
      console.error("CreateRegistrationUseCase error:", error);

      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        error instanceof Error
          ? error.message
          : "Failed to create supplier registration",
        500,
      );
    }
  }
}
