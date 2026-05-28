// demand.route.ts

import { Router } from "express";

import { DemandController } from "../controllers/demand.controller";

import { authenticate } from "../middlewares/authenticate.middleware";

export const createDemandRoute = (controller: DemandController) => {
  const router = Router();

  router.use(authenticate);

  router.post("/", controller.createDemand);

  router.get("/", controller.getDemandList);

  router.get("/:id", controller.getDemandDetail);

  router.put("/:id", controller.updateDemand);

  router.post("/:id/submit", controller.submitDemand);

  router.post("/:id/approve", controller.approveDemand);

  router.post("/:id/reject", controller.rejectDemand);

  router.post("/:id/assign-employee", controller.assignEmployee);

  router.post("/:id/confirm", controller.confirmDemand);

  return router;
};
