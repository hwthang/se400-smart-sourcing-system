// app.route.ts

import { Router } from "express";

import { createContractRoute } from "./contract.route";
import { createDemandRoute } from "./demand.route";
import { createSupplierQuotationRoute } from "./supplier-quotation.route";
import { createBuyerCriteriaRoute } from "./buyer-criteria.route";
import { createSupplierRegistrationRoute } from "./supplier-registration.route";
import { createOrderRoute } from "./order.route";
import { createAuthRoute } from "./auth.route";
import { createBlockchainTransactionRoute } from "./blockchain-transaction.route";

export const createAppRoute = (controllers: any) => {
  const router = Router();

  router.use("/auth", createAuthRoute(controllers.authController));

  // =========================================================
  // CONTRACTS
  // =========================================================

  router.use("/contracts", createContractRoute(controllers.contractController));

  // =========================================================
  // DEMANDS
  // =========================================================

  router.use("/demands", createDemandRoute(controllers.demandController));

  // =========================================================
  // QUOTATIONS
  // =========================================================

  router.use(
    "/supplier-quotations",
    createSupplierQuotationRoute(controllers.supplierQuotationController),
  );

  // =========================================================
  // BUYER CRITERIA
  // =========================================================

  router.use(
    "/buyer-criteria",
    createBuyerCriteriaRoute(controllers.buyerCriteriaController),
  );

  // =========================================================
  // REGISTRATIONS
  // =========================================================

  router.use(
    "/supplier-registrations",
    createSupplierRegistrationRoute(controllers.supplierRegistrationController),
  );

  // =========================================================
  // ORDERS
  // =========================================================

  router.use("/orders", createOrderRoute(controllers.orderController));

  router.use(
    "/blockchain-transactions",
    createBlockchainTransactionRoute(
      controllers.blockchainTransactionController
    ),
  );

  return router;
};
