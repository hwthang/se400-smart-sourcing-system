// order.route.ts

import { Router } from "express";

import { OrderController } from "../controllers/order.controller";

import { authenticate } from "../middlewares/authenticate.middleware";

export const createOrderRoute = (controller: OrderController) => {
  const router = Router();

  router.use(authenticate);

  router.post("/:id/confirm", controller.confirmOrder);

  router.post("/:id/start-delivery", controller.startDelivery);

  router.post("/:id/start-inspection", controller.startInspection);
  router.post("/:id/complete-delivery", controller.completeDelivery);

  router.post("/:id/complete-inspection", controller.completeInspection);

  router.post(
    "/:id/release-supplier-payment",
    controller.releaseSupplierPayment,
  );
  return router;
};
