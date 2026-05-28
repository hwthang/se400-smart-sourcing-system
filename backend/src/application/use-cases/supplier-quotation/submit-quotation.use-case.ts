// submit-quotation.use-case.ts

import { AppError } from "../../../presentation/errors/app.error";

import { AuthUser } from "../../common/auth-user";

import { SupplierQuotationRepository } from "../../repositories/supplier-quotation.repo";
import { SupplierRegistrationRepository } from "../../repositories/supplier-registration.repo";

type SubmitQuotationUseCaseRepos = {
  quotationRepo: SupplierQuotationRepository;
  registrationRepo: SupplierRegistrationRepository;
};

type SubmitQuotationInput = {
  quotationId: string;
  authUser: AuthUser;
};

export class SubmitQuotationUseCase {
  constructor(private readonly repos: SubmitQuotationUseCaseRepos) {}

  async execute(input: SubmitQuotationInput) {
    const quotation = await this.repos.quotationRepo.findById(
      input.quotationId,
    );

    if (!quotation) {
      throw new AppError("Quotation not found", 404);
    }

    const registration = await this.repos.registrationRepo.findById(
      quotation.registrationId,
    );

    if (!registration) {
      throw new AppError("Supplier registration not found", 404);
    }

    if (registration.supplierId !== input.authUser.id) {
      throw new AppError("Forbidden", 403);
    }

    try {
      quotation.submit();

      await this.repos.quotationRepo.save(quotation);

      return quotation;
    } catch (error) {
      if (error instanceof Error) {
        throw new AppError(error.message, 400);
      }

      throw new AppError("Failed to submit quotation");
    }
  }
}
