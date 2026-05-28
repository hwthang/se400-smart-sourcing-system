// supplier-registration.route.ts

import { Router } from "express";

import { SupplierRegistrationController } from "../controllers/supplier-registration.controller";

import { authenticate } from "../middlewares/authenticate.middleware";

export const createSupplierRegistrationRoute = (
  controller: SupplierRegistrationController,
) => {
  const router = Router();

  router.use(authenticate);

  router.post(
    "/",
    controller.createRegistration,
  );

  router.post(
    "/:id/confirm",
    controller.confirmRegistration,
  );

  router.post(
    "/:id/cancel",
    controller.cancelRegistration,
  );

  return router;
};