// contract.container.ts

import { repositories } from "../repositories.bootstrap";
import { services } from "../services.bootstrap";

import { ContractController } from "../../presentation/controllers/contract.controller";

// =========================================================
// USE CASES - Registration Phase
// =========================================================
import { CreateContractUseCase } from "../../application/use-cases/contract/create-contract.use-case";
import { UpdateContractUseCase } from "../../application/use-cases/contract/update-contract.use-case";
import { OpenSupplierRegistrationUseCase } from "../../application/use-cases/contract/open-supplier-registration.use-case";
import { CloseSupplierRegistrationUseCase } from "../../application/use-cases/contract/close-supplier-regsitration.use-case";

// =========================================================
// USE CASES - Deploy
// =========================================================
import { DeployContractUseCase } from "../../application/use-cases/contract/deploy-contract.use-case";

// =========================================================
// USE CASES - Ordering Phase
// =========================================================
import { RegisterCustomerUseCase } from "../../application/use-cases/contract/register-customer.use-case";
import { RegisterSupplierUseCase } from "../../application/use-cases/contract/register-supplier.use-case";
import { StartOrderingPhaseUseCase } from "../../application/use-cases/contract/start-ordering-phase.use-case";

// =========================================================
// USE CASES - Allocation Phase
// =========================================================
import { StartAllocationPhaseUseCase } from "../../application/use-cases/contract/start-allocation-phase.use-case";
import { RunAllocationUseCase } from "../../application/use-cases/contract/run-allocation.use-case";
import { RequestFundUseCase } from "../../application/use-cases/contract/request-fund.use-case";
import { DepositUseCase } from "../../application/use-cases/contract/deposit.use-case";

// =========================================================
// USE CASES - Executing Phase
// =========================================================
import { StartExecutingPhaseUseCase } from "../../application/use-cases/contract/start-executing-phase.use-case";
import { FinishUseCase } from "../../application/use-cases/contract/finish.use-case";

// =========================================================
// USE CASES - Query
// =========================================================
import { GetContractDetailUseCase } from "../../application/use-cases/contract/get-contract-detail.use-case";
import { GetContractListUseCase } from "../../application/use-cases/contract/get-contract-list.use-case";
import { AllocationService } from "../../application/services/allocation.service";

const { sourcingSystemService } = services;

// =========================================================
// REPOSITORIES
// =========================================================

const {
  contractRepo,
  demandRepo,
  quotationRepo,
  orderRepo,
  criteriaRepo,
  userRepo,
  registrationRepo,
  transactionRepo,
} = repositories;

// =========================================================
// USE CASES INSTANCES - Registration Phase
// =========================================================

const createContractUseCase = new CreateContractUseCase({
  contractRepo,
  demandRepo,
});

const updateContractUseCase = new UpdateContractUseCase({
  contractRepo,
  demandRepo,
});

const openSupplierRegistrationUseCase = new OpenSupplierRegistrationUseCase({
  contractRepo,
  demandRepo,
});

const closeSupplierRegistrationUseCase = new CloseSupplierRegistrationUseCase({
  contractRepo,
  demandRepo,
  quotationRepo,
});

// =========================================================
// USE CASES INSTANCES - Deploy
// =========================================================

const deployContractUseCase = new DeployContractUseCase(
  {
    contractRepo,
    demandRepo,
    userRepo,
    transactionRepo,
  },
  sourcingSystemService,
);

// =========================================================
// USE CASES INSTANCES - Ordering Phase
// =========================================================

const registerCustomerUseCase = new RegisterCustomerUseCase({
  contractRepo,
  transactionRepo,
});

const registerSupplierUseCase = new RegisterSupplierUseCase({
  contractRepo,
  registrationRepo,
  transactionRepo,
  userRepo,
});

const startOrderingPhaseUseCase = new StartOrderingPhaseUseCase({
  contractRepo,
  demandRepo,
  quotationRepo,
  transactionRepo,
});

// =========================================================
// USE CASES INSTANCES - Allocation Phase
// =========================================================

const startAllocationPhaseUseCase = new StartAllocationPhaseUseCase({
  contractRepo,
  transactionRepo,
});

const runAllocationUseCase = new RunAllocationUseCase(
  {
    contractRepo,
    registrationRepo,
    orderRepo,
    demandRepo,
    quotationRepo,
    criteriaRepo,
    userRepo,
    transactionRepo,
  },
  { allocationService: new AllocationService() },
);

const requestFundUseCase = new RequestFundUseCase({
  contractRepo,
  demandRepo,
});

const depositUseCase = new DepositUseCase({
  contractRepo,
  transactionRepo,
});

// =========================================================
// USE CASES INSTANCES - Executing Phase
// =========================================================

const startExecutingPhaseUseCase = new StartExecutingPhaseUseCase({
  contractRepo,
  transactionRepo,
});

const finishUseCase = new FinishUseCase({
  contractRepo,
  transactionRepo,
});

// =========================================================
// USE CASES INSTANCES - Query
// =========================================================

const getContractDetailUseCase = new GetContractDetailUseCase({
  contractRepo,
  registrationRepo,
  quotationRepo,
  criteriaRepo,
  orderRepo,
  demandRepo,
  userRepo,
});

const getContractListUseCase = new GetContractListUseCase({
  contractRepo,
});

// =========================================================
// CONTROLLER
// =========================================================

export const contractController = new ContractController({
  // Registration Phase
  createContract: createContractUseCase,
  updateContract: updateContractUseCase,
  openSupplierRegistration: openSupplierRegistrationUseCase,
  closeSupplierRegistration: closeSupplierRegistrationUseCase,

  // Deploy
  deployContract: deployContractUseCase,

  // Ordering Phase
  registerCustomer: registerCustomerUseCase,
  registerSupplier: registerSupplierUseCase,
  startOrderingPhase: startOrderingPhaseUseCase,

  // Allocation Phase
  startAllocationPhase: startAllocationPhaseUseCase,
  runAllocation: runAllocationUseCase,
  requestFund: requestFundUseCase,
  deposit: depositUseCase,

  // Executing Phase
  startExecutingPhase: startExecutingPhaseUseCase,
  finish: finishUseCase,

  // Query
  getContractDetail: getContractDetailUseCase,
  getContractList: getContractListUseCase,
});
