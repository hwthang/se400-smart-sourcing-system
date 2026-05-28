// bootstrap/repositories.bootstrap.ts

import { MongoUserRepository } from "../infrastructure/persistence/repositories/mongo-user.repo";

import { MongoContractRepository } from "../infrastructure/persistence/repositories/mongo-contract.repo";

import { MongoDemandRepository } from "../infrastructure/persistence/repositories/mongo-demand.repo";

import { MongoSupplierQuotationRepository } from "../infrastructure/persistence/repositories/mongo-supplier-quotation.repo";

import { MongoSupplierRegistrationRepository } from "../infrastructure/persistence/repositories/mongo-supplier-registration.repo";

import { MongoBuyerCriteriaRepository } from "../infrastructure/persistence/repositories/mongo-buyer-criteria.repo";

import { MongoOrderRepository } from "../infrastructure/persistence/repositories/mongo-order.repo";

// =========================================================
// USER
// =========================================================

const userRepo = new MongoUserRepository();

// =========================================================
// CONTRACT
// =========================================================

const contractRepo = new MongoContractRepository();

// =========================================================
// DEMAND
// =========================================================

const demandRepo = new MongoDemandRepository();

// =========================================================
// SUPPLIER QUOTATION
// =========================================================

const quotationRepo = new MongoSupplierQuotationRepository();

// =========================================================
// SUPPLIER REGISTRATION
// =========================================================

const registrationRepo = new MongoSupplierRegistrationRepository();

// =========================================================
// BUYER CRITERIA
// =========================================================

const criteriaRepo = new MongoBuyerCriteriaRepository();

// =========================================================
// ORDER
// =========================================================

const orderRepo = new MongoOrderRepository();

// =========================================================
// EXPORT CONTAINER
// =========================================================

export const repositories = {
  userRepo,

  contractRepo,

  demandRepo,

  quotationRepo,

  registrationRepo,

  criteriaRepo,

  orderRepo,
};
