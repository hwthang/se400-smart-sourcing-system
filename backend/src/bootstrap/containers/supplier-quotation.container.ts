// supplier-quotation.container.ts

import { repositories } from "../repositories.bootstrap";

import { SupplierQuotationController } from "../../presentation/controllers/supplier-quotation.controller";

import { CreateQuotationUseCase } from "../../application/use-cases/supplier-quotation/create-quotation.use-case";

import { UpdateQuotationUseCase } from "../../application/use-cases/supplier-quotation/update-quotation.use-case";

import { SubmitQuotationUseCase } from "../../application/use-cases/supplier-quotation/submit-quotation.use-case";

import { ApproveQuotationUseCase } from "../../application/use-cases/supplier-quotation/approve-quotation.use-case";

import { RejectQuotationUseCase } from "../../application/use-cases/supplier-quotation/reject-quotation.use-case";
import { ConfirmSupplierQuotationUseCase } from "../../application/use-cases/supplier-quotation/confirm-supplier-quotation.use-case";

// =========================================================
// REPOSITORIES
// =========================================================

const {
  quotationRepo,

  registrationRepo,

  contractRepo,

  demandRepo,
} = repositories;

// =========================================================
// USE CASES
// =========================================================

const createQuotationUseCase = new CreateQuotationUseCase({
  quotationRepo,

  registrationRepo,

  contractRepo,
});

const updateQuotationUseCase = new UpdateQuotationUseCase({
  quotationRepo,
});

const submitQuotationUseCase = new SubmitQuotationUseCase({
  quotationRepo,

  registrationRepo,
});

const approveQuotationUseCase = new ApproveQuotationUseCase({
  quotationRepo,

  registrationRepo,

  contractRepo,

  demandRepo,
});

const rejectQuotationUseCase = new RejectQuotationUseCase({
  quotationRepo,

  registrationRepo,

  contractRepo,

  demandRepo,
});

const confirmQuotationUseCase = new ConfirmSupplierQuotationUseCase({
  contractRepo,
  registrationRepo,
  quotationRepo,
});
// =========================================================
// CONTROLLER
// =========================================================

export const supplierQuotationController = new SupplierQuotationController({
  createQuotation: createQuotationUseCase,

  updateQuotation: updateQuotationUseCase,

  submitQuotation: submitQuotationUseCase,

  approveQuotation: approveQuotationUseCase,

  rejectQuotation: rejectQuotationUseCase,

  confirmQuotation: confirmQuotationUseCase,
});
