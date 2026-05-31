// app.container.ts

import { authController } from "./auth.container";

import { contractController } from "./contract.container";

import { demandController } from "./demand.container";

import { supplierQuotationController } from "./supplier-quotation.container";

import { supplierRegistrationController } from "./supplier-registration.container";

import { buyerCriteriaController } from "./buyer-criteria.container";

import { orderController } from "./order.container";
import { blockchainTransactionController } from "./blockchain-transaction.container";

export const appContainer = {
  controllers: {
    authController,

    contractController,

    demandController,

    supplierQuotationController,

    supplierRegistrationController,

    buyerCriteriaController,

    orderController,
    blockchainTransactionController,
  },
};
