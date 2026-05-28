// create-quotation.use-case.ts

import { AppError } from "../../../presentation/errors/app.error";

import { AuthUser } from "../../common/auth-user";

import { SupplierQuotation } from "../../../domain/entities/supplier-quotation.entity";

import { SupplierQuotationRepository } from "../../repositories/supplier-quotation.repo";
import { SupplierRegistrationRepository } from "../../repositories/supplier-registration.repo";
import { ContractRepository } from "../../repositories/contract.repo";

type CreateQuotationUseCaseRepos = {
  quotationRepo: SupplierQuotationRepository;
  registrationRepo: SupplierRegistrationRepository;
  contractRepo: ContractRepository;
};

type CreateQuotationInput = {
  registrationId: string;

  unitPrice: number;
  minSupplyQuantity: number;
  maxSupplyQuantity: number;

  maxDefectRate: number;
  maxLeadTimeDays: number;

  authUser: AuthUser;
};

export class CreateQuotationUseCase {
  constructor(private readonly repos: CreateQuotationUseCaseRepos) {}

  async execute(input: CreateQuotationInput) {
    const registration = await this.repos.registrationRepo.findById(
      input.registrationId,
    );

    if (!registration) {
      throw new AppError("Supplier registration not found", 404);
    }

    const existedQuotation =
      await this.repos.quotationRepo.findByRegistrationId(registration.id!);

    if (existedQuotation) {
      throw new AppError("Quotation already exists", 400);
    }

    try {
      const quotation = SupplierQuotation.create({
        registrationId: registration.id!,

        unitPrice: input.unitPrice,

        minSupplyQuantity: input.minSupplyQuantity,

        maxSupplyQuantity: input.maxSupplyQuantity,

        maxDefectRate: input.maxDefectRate,

        maxLeadTimeDays: input.maxLeadTimeDays,
      });

      await this.repos.quotationRepo.save(quotation);

      return quotation;
    } catch (error) {
      if (error instanceof Error) {
        throw new AppError(error.message, 400);
      }

      throw new AppError("Failed to create quotation");
    }
  }
}
