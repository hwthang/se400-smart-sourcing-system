// supplier-registration.container.ts

import { repositories } from "../repositories.bootstrap";

import { SupplierRegistrationController } from "../../presentation/controllers/supplier-registration.controller";

import { CreateRegistrationUseCase } from "../../application/use-cases/supplier-registration/create-registration.use-case";

import { CancelRegistrationUseCase } from "../../application/use-cases/supplier-registration/cancel-registration.use-case";

// =========================================================
// REPOSITORIES
// =========================================================

const {
  registrationRepo,

  contractRepo,

  demandRepo,

} = repositories;

// =========================================================
// USE CASES
// =========================================================

const createRegistrationUseCase = new CreateRegistrationUseCase({
  registrationRepo,

  contractRepo,
});

const cancelRegistrationUseCase = new CancelRegistrationUseCase({
  registrationRepo,

  contractRepo,
  demandRepo,
});

// =========================================================
// CONTROLLER
// =========================================================

export const supplierRegistrationController =
  new SupplierRegistrationController({
    createRegistration: createRegistrationUseCase,

    cancelRegistration: cancelRegistrationUseCase,
  });
