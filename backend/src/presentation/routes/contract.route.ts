import { Router } from "express";

import { authenticate } from "../middlewares/authenticate.middleware";

import { ContractController } from "../controllers/contract.controller";

export const createContractRoute = (
  controller: ContractController,
) => {
  const router = Router();

  // =========================================================
  // MIDDLEWARES
  // =========================================================

  router.use(authenticate);

  // =========================================================
  // 1. CREATE CONTRACT
  // =========================================================

  router.post(
    "/",
    controller.createContract,
  );

  // =========================================================
  // 2. UPDATE CONTRACT
  // =========================================================

  router.patch(
    "/:id",
    controller.updateContract,
  );

  // =========================================================
  // 3. OPEN SUPPLIER REGISTRATION
  // =========================================================

  router.post(
    "/:id/open-supplier-registration",
    controller.openSupplierRegistration,
  );

  // =========================================================
  // 4. CLOSE SUPPLIER REGISTRATION
  // =========================================================

  router.post(
    "/:id/close-supplier-registration",
    controller.closeSupplierRegistration,
  );

  // =========================================================
  // 5. DEPLOY CONTRACT
  // =========================================================

  router.post(
    "/:id/deploy",
    controller.deployContract,
  );

  // =========================================================
  // 6. REGISTER CUSTOMER
  // =========================================================

  router.post(
    "/:id/register-customer",
    controller.registerCustomer,
  );

  // =========================================================
  // 7. REGISTER SUPPLIER
  // =========================================================

  router.post(
    "/:id/register-supplier",
    controller.registerSupplier,
  );

  // =========================================================
  // 8. START ORDERING PHASE
  // =========================================================

  router.post(
    "/:id/start-ordering-phase",
    controller.startOrderingPhase,
  );

  // =========================================================
  // 9. START ALLOCATION PHASE
  // =========================================================

  router.post(
    "/:id/start-allocation-phase",
    controller.startAllocationPhase,
  );

  // =========================================================
  // 10. RUN ALLOCATION
  // =========================================================

  router.post(
    "/:id/run-allocation",
    controller.runAllocation,
  );

  // =========================================================
  // 11. REQUEST FUND
  // =========================================================

  router.post(
    "/:id/request-fund",
    controller.requestFund,
  );

  // =========================================================
  // 12. DEPOSIT
  // =========================================================

  router.post(
    "/:id/deposit",
    controller.deposit,
  );

  // =========================================================
  // 13. START EXECUTING PHASE
  // =========================================================

  router.post(
    "/:id/start-executing-phase",
    controller.startExecutingPhase,
  );

  // =========================================================
  // 14. FINISH
  // =========================================================

  router.post(
    "/:id/finish",
    controller.finish,
  );

  // =========================================================
  // 15. GET CONTRACT DETAIL
  // =========================================================

  router.get(
    "/:id",
    controller.getContractDetail,
  );

  // =========================================================
  // 16. GET CONTRACT LIST
  // =========================================================

  router.get(
    "/",
    controller.getContractList,
  );

  return router;
};