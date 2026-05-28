// update-quotation.use-case.ts

import { SupplierQuotationRepository } from "../../repositories/supplier-quotation.repo";

type UpdateQuotationInput = {
  quotationId: string;

  unitPrice: number;
  minSupplyQuantity: number;
  maxSupplyQuantity: number;

  maxDefectRate: number;
  maxLeadTimeDays: number;
};

type UpdateContractUseCaseRepos = {
  quotationRepo: SupplierQuotationRepository;
};

export class UpdateQuotationUseCase {
  constructor(private readonly repos: UpdateContractUseCaseRepos) {}

  async execute(input: UpdateQuotationInput) {
    const quotation = await this.repos.quotationRepo.findById(
      input.quotationId,
    );

    if (!quotation) {
      throw new Error("Quotation not found");
    }

    quotation.update({
      unitPrice: input.unitPrice,
      minSupplyQuantity: input.minSupplyQuantity,
      maxSupplyQuantity: input.maxSupplyQuantity,
      maxDefectRate: input.maxDefectRate,
      maxLeadTimeDays: input.maxLeadTimeDays,
    });

    await this.repos.quotationRepo.save(quotation);

    return quotation;
  }
}
