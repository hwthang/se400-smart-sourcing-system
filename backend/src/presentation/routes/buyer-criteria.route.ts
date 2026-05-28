// buyer-criteria.route.ts

import { Router } from "express";

import { BuyerCriteriaController } from "../controllers/buyer-criteria.controller";

import { authenticate } from "../middlewares/authenticate.middleware";

export const createBuyerCriteriaRoute = (
  controller: BuyerCriteriaController,
) => {
  const router = Router();

  router.use(authenticate);

  router.post("/", controller.createCriteria);

  router.put("/:id", controller.updateCriteria);

  router.put("/:id/confirm", controller.confirmCriteria);

  return router;
};
