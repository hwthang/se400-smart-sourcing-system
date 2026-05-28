import { HandleBuyerCriteriaConfiguredUseCase } from "../../application/use-cases/on-chain/handle-buyer-criteria-configured.use-case";
import { HandleBuyerDepositedUseCase } from "../../application/use-cases/on-chain/handle-buyer-deposited.use-case";
import { HandleCustomerRegisteredUseCase } from "../../application/use-cases/on-chain/handle-customer-registered.use-case";
import { HandleDemandCreatedUseCase } from "../../application/use-cases/on-chain/handle-demand-created.use-case";
import { HandleOrderCreatedUseCase } from "../../application/use-cases/on-chain/handle-order-created.use-case";
import { HandleOrderDeliveryCompletedUseCase } from "../../application/use-cases/on-chain/handle-order-delivery-completed.use-case";
import { HandleOrderInspectionCompletedUseCase } from "../../application/use-cases/on-chain/handle-order-inspection-completed.use-case";
import { HandlePhaseChangedUseCase } from "../../application/use-cases/on-chain/handle-phase-changed.use-case";
import { HandleSupplierPaymentReleasedUseCase } from "../../application/use-cases/on-chain/handle-supplier-payment-release.use-case";
import { HandleSupplierQuotationSubmittedUseCase } from "../../application/use-cases/on-chain/handle-supplier-quotation-submitted.use-case";
import { HandleSupplierRegisteredUseCase } from "../../application/use-cases/on-chain/handle-supplier-registered.use-case";
import { OnChainUseCases } from "../../application/use-cases/on-chain/on-chain-use-cases";
import { repositories } from "../repositories.bootstrap";

export const buildOnChainUseCases = (): OnChainUseCases => {
  const {
    contractRepo,
    demandRepo,
    userRepo,
    registrationRepo,
    criteriaRepo,
    orderRepo,
    quotationRepo,
  } = repositories;

  return {
    handleBuyerCriteriaConfiguredUseCase:
      new HandleBuyerCriteriaConfiguredUseCase({
        contractRepo,
        criteriaRepo,
        registrationRepo,
        userRepo,
      }),

    handleBuyerDepositedUseCase: new HandleBuyerDepositedUseCase({
      contractRepo,
    }),

    handleCustomerRegisteredUseCase: new HandleCustomerRegisteredUseCase({
      contractRepo,
    }),

    handleDemandCreatedUseCase: new HandleDemandCreatedUseCase({
      contractRepo,
      demandRepo,
    }),

    handleOrderCreatedUseCase: new HandleOrderCreatedUseCase({
      contractRepo,
      userRepo,
      registrationRepo,
      orderRepo,
    }),

    handleOrderDeliveryCompletedUseCase:
      new HandleOrderDeliveryCompletedUseCase({
        contractRepo,
        userRepo,
        registrationRepo,
        orderRepo,
      }),

    handleOrderInspectionCompletedUseCase:
      new HandleOrderInspectionCompletedUseCase({
        contractRepo,
        userRepo,
        registrationRepo,
        orderRepo,
      }),

    handlePhaseChangedUseCase: new HandlePhaseChangedUseCase(contractRepo),

    handleSupplierPaymentReleaseUseCase:
      new HandleSupplierPaymentReleasedUseCase({
        contractRepo,
        userRepo,
        registrationRepo,
        orderRepo,
      }),

    handleSupplierQuotationSubmittedUseCase:
      new HandleSupplierQuotationSubmittedUseCase({
        contractRepo,
        userRepo,
        registrationRepo,
        quotationRepo,
      }),

    handleSupplierRegisteredUseCase: new HandleSupplierRegisteredUseCase({
      contractRepo,
      userRepo,
      registrationRepo,
    }),
  };
};
