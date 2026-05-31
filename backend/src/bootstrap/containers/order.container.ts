// order.container.ts

import { repositories } from "../repositories.bootstrap";

import { OrderController } from "../../presentation/controllers/order.controller";

// =========================================================
// USE CASES
// =========================================================

import { ConfirmOrderUseCase } from "../../application/use-cases/order/confirm-order.use-case";
import { StartDeliveryUseCase } from "../../application/use-cases/order/start-delivery.use-case";
import { StartInspectionUseCase } from "../../application/use-cases/order/start-inspection.use-case";

import { CompleteDeliveryUseCase } from "../../application/use-cases/order/complete-delivery.use-case";
import { CompleteInspectionUseCase } from "../../application/use-cases/order/complete-inspection.use-case";
import { ReleaseSupplierPaymentUseCase } from "../../application/use-cases/order/release-supplier-payment.use-case";

// =========================================================
// REPOSITORIES
// =========================================================

const { orderRepo, registrationRepo, contractRepo, demandRepo, userRepo, transactionRepo } =
  repositories;

// =========================================================
// USE CASE INSTANCES
// =========================================================

const confirmOrderUseCase = new ConfirmOrderUseCase({
  orderRepo,
  registrationRepo,
});

const startDeliveryUseCase = new StartDeliveryUseCase({
  orderRepo,
  registrationRepo,
});

const startInspectionUseCase = new StartInspectionUseCase({
  orderRepo,
  registrationRepo,
  contractRepo,
  demandRepo,
});

const completeDeliveryUseCase = new CompleteDeliveryUseCase({
  orderRepo,
  registrationRepo,
  contractRepo,
  userRepo,
  transactionRepo
});

const completeInspectionUseCase = new CompleteInspectionUseCase({
  orderRepo,
  registrationRepo,
  contractRepo,
  userRepo,
  transactionRepo
});

const releaseSupplierPaymentUseCase = new ReleaseSupplierPaymentUseCase({
  orderRepo,
  registrationRepo,
  contractRepo,
  userRepo,
  transactionRepo
});

// =========================================================
// CONTROLLER
// =========================================================

export const orderController = new OrderController({
  confirmOrder: confirmOrderUseCase,
  startDelivery: startDeliveryUseCase,
  startInspection: startInspectionUseCase,
  completeDelivery: completeDeliveryUseCase,
  completeInspection: completeInspectionUseCase,
  releaseSupplierPayment: releaseSupplierPaymentUseCase,
});
