// supplier-quotation.route.ts

import { Router } from "express";

import { SupplierQuotationController } from "../controllers/supplier-quotation.controller";

import { authenticate } from "../middlewares/authenticate.middleware";

export const createSupplierQuotationRoute = (
  controller: SupplierQuotationController,
) => {
  const router = Router();

  router.use(authenticate);

  router.post(
    "/",
    controller.createQuotation,
  );

  router.get(
    "/",
    controller.getQuotationList,
  );

  router.get(
    "/:id",
    controller.getQuotationDetail,
  );

  router.put(
    "/:id",
    controller.updateQuotation,
  );

  router.post(
    "/:id/submit",
    controller.submitQuotation,
  );

  router.post(
    "/:id/approve",
    controller.approveQuotation,
  );

  router.post(
    "/:id/reject",
    controller.rejectQuotation,
  );

  
  router.post(
    "/:id/confirm",
    controller.confirmQuotation,
  );

  return router;
};