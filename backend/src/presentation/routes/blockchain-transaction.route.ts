import { Router } from "express";
import { BlockchainTransactionController } from "../controllers/blockchain-transaction.controller";

export const createBlockchainTransactionRoute = (
  controller: BlockchainTransactionController,
) => {
  const router = Router();

  // ================= AUTH =================

  router.get("/", controller.getTransactionList);

  return router;
};
