// buyer-criteria.container.ts

import { repositories } from "../repositories.bootstrap";

import { BuyerCriteriaController } from "../../presentation/controllers/buyer-criteria.controller";

import { CreateCriteriaUseCase } from "../../application/use-cases/buyer-criteria/create-criteria.use-case";

import { UpdateCriteriaUseCase } from "../../application/use-cases/buyer-criteria/update-criteria.use-case";
import { ConfirmBuyerCriteriaUseCase } from "../../application/use-cases/buyer-criteria/confirm-buyer-criteria.use-case";

// =========================================================
// REPOSITORIES
// =========================================================

const {
  criteriaRepo,

  registrationRepo,

  contractRepo,

  demandRepo,
  transactionRepo,
  userRepo,
} = repositories;

// =========================================================
// USE CASES
// =========================================================

const createCriteriaUseCase = new CreateCriteriaUseCase({
  criteriaRepo,

  registrationRepo,

  contractRepo,

  demandRepo,
});

const updateCriteriaUseCase = new UpdateCriteriaUseCase({
  criteriaRepo,

  registrationRepo,

  contractRepo,

  demandRepo,
});

const confirmCriteriaUseCase = new ConfirmBuyerCriteriaUseCase({
  contractRepo,
  registrationRepo,
  criteriaRepo,
  userRepo,
  transactionRepo,
});

// =========================================================
// CONTROLLER
// =========================================================

export const buyerCriteriaController = new BuyerCriteriaController({
  createCriteria: createCriteriaUseCase,

  updateCriteria: updateCriteriaUseCase,
  confirmCriteria: confirmCriteriaUseCase,
});
