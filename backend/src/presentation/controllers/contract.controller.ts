import { NextFunction, Response } from "express";

import { AuthRequest } from "../middlewares/authenticate.middleware";

import { sendListResponse, sendResponse } from "../utils/response";

import { AuthUser } from "../../application/common/auth-user";

import { ContractListQuery } from "../../application/repositories/contract.repo";

import { ContractStatus } from "../../domain/enums/contract-status.enum";

// =========================================================
// USE CASES
// =========================================================

import { CreateContractUseCase } from "../../application/use-cases/contract/create-contract.use-case";
import { UpdateContractUseCase } from "../../application/use-cases/contract/update-contract.use-case";

import { OpenSupplierRegistrationUseCase } from "../../application/use-cases/contract/open-supplier-registration.use-case";
import { CloseSupplierRegistrationUseCase } from "../../application/use-cases/contract/close-supplier-regsitration.use-case";

import { DeployContractUseCase } from "../../application/use-cases/contract/deploy-contract.use-case";

import { RegisterCustomerUseCase } from "../../application/use-cases/contract/register-customer.use-case";
import { RegisterSupplierUseCase } from "../../application/use-cases/contract/register-supplier.use-case";

import { StartOrderingPhaseUseCase } from "../../application/use-cases/contract/start-ordering-phase.use-case";
import { StartAllocationPhaseUseCase } from "../../application/use-cases/contract/start-allocation-phase.use-case";

import { RunAllocationUseCase } from "../../application/use-cases/contract/run-allocation.use-case";

import { RequestFundUseCase } from "../../application/use-cases/contract/request-fund.use-case";
import { DepositUseCase } from "../../application/use-cases/contract/deposit.use-case";

import { StartExecutingPhaseUseCase } from "../../application/use-cases/contract/start-executing-phase.use-case";

import { FinishUseCase } from "../../application/use-cases/contract/finish.use-case";

import { GetContractDetailUseCase } from "../../application/use-cases/contract/get-contract-detail.use-case";
import { GetContractListUseCase } from "../../application/use-cases/contract/get-contract-list.use-case";

type ContractControllerUseCases = {
  createContract: CreateContractUseCase;

  updateContract: UpdateContractUseCase;

  openSupplierRegistration: OpenSupplierRegistrationUseCase;

  closeSupplierRegistration: CloseSupplierRegistrationUseCase;

  deployContract: DeployContractUseCase;

  registerCustomer: RegisterCustomerUseCase;

  registerSupplier: RegisterSupplierUseCase;

  startOrderingPhase: StartOrderingPhaseUseCase;

  startAllocationPhase: StartAllocationPhaseUseCase;

  runAllocation: RunAllocationUseCase;

  requestFund: RequestFundUseCase;

  deposit: DepositUseCase;

  startExecutingPhase: StartExecutingPhaseUseCase;

  finish: FinishUseCase;

  getContractDetail: GetContractDetailUseCase;

  getContractList: GetContractListUseCase;
};

export class ContractController {
  constructor(private readonly useCases: ContractControllerUseCases) {}

  // =========================================================
  // 1. CREATE CONTRACT
  // =========================================================

  createContract = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const contract = await this.useCases.createContract.execute({
        ...req.body,
        authUser: req.user,
      });

      return sendResponse(res, contract, "Create contract successfully", 201);
    } catch (error) {
      next(error);
    }
  };

  // =========================================================
  // 2. UPDATE CONTRACT
  // =========================================================

  updateContract = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const result = await this.useCases.updateContract.execute({
        contractId: req.params.id as string,
        dto: req.body,
        authUser: req.user,
      });

      return sendResponse(res, result, "Update contract successfully");
    } catch (error) {
      next(error);
    }
  };

  // =========================================================
  // 3. OPEN SUPPLIER REGISTRATION
  // =========================================================

  openSupplierRegistration = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const result = await this.useCases.openSupplierRegistration.execute({
        contractId: req.params.id as string,
        authUser: req.user,
      });

      return sendResponse(
        res,
        result,
        "Open supplier registration successfully",
      );
    } catch (error) {
      next(error);
    }
  };

  // =========================================================
  // 4. CLOSE SUPPLIER REGISTRATION
  // =========================================================

  closeSupplierRegistration = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const result = await this.useCases.closeSupplierRegistration.execute({
        contractId: req.params.id as string,
        authUser: req.user,
      });

      return sendResponse(
        res,
        result,
        "Close supplier registration successfully",
      );
    } catch (error) {
      next(error);
    }
  };

  // =========================================================
  // 5. DEPLOY CONTRACT
  // =========================================================

  deployContract = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const result = await this.useCases.deployContract.execute({
        contractId: req.params.id as string,
        authUser: req.user,
      });

      return sendResponse(res, result, "Deploy contract successfully");
    } catch (error) {
      next(error);
    }
  };

  // =========================================================
  // 6. REGISTER CUSTOMER
  // =========================================================

  registerCustomer = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const result = await this.useCases.registerCustomer.execute({
        txHash: req.body.txHash,
        contractAddress: req.body.contractAddress,
      });

      return sendResponse(res, result, "Register customer successfully");
    } catch (error) {
      next(error);
    }
  };

  // =========================================================
  // 7. REGISTER SUPPLIER
  // =========================================================

  registerSupplier = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const result = await this.useCases.registerSupplier.execute({
        txHash: req.body.txHash,
        contractAddress: req.body.contractAddress,
        authUser: req.user,
      });

      return sendResponse(res, result, "Register supplier successfully");
    } catch (error) {
      next(error);
    }
  };

  // =========================================================
  // 8. START ORDERING PHASE
  // =========================================================

  startOrderingPhase = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const result = await this.useCases.startOrderingPhase.execute({
        txHash: req.body.txHash,
        contractAddress: req.body.contractAddress,
      });

      return sendResponse(res, result, "Start ordering phase successfully");
    } catch (error) {
      next(error);
    }
  };

  // =========================================================
  // 9. START ALLOCATION PHASE
  // =========================================================

  startAllocationPhase = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const result = await this.useCases.startAllocationPhase.execute({
        txHash: req.body.txHash,
        contractAddress: req.body.contractAddress,
      });

      return sendResponse(res, result, "Start allocation phase successfully");
    } catch (error) {
      next(error);
    }
  };

  // =========================================================
  // 10. RUN ALLOCATION
  // =========================================================

  runAllocation = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const result = await this.useCases.runAllocation.execute({
        contractId: req.params.id as string,
        authUser: req.user,
      });

      return sendResponse(res, result, "Run allocation successfully");
    } catch (error) {
      next(error);
    }
  };

  // =========================================================
  // 11. REQUEST FUND
  // =========================================================

  requestFund = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const result = await this.useCases.requestFund.execute({
        contractId: req.params.id as string,
        authUser: req.user,
      });

      return sendResponse(res, result, "Request fund successfully");
    } catch (error) {
      next(error);
    }
  };

  // =========================================================
  // 12. DEPOSIT
  // =========================================================

  deposit = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const result = await this.useCases.deposit.execute({
        txHash: req.body.txHash,
        contractAddress: req.body.contractAddress,
      });

      return sendResponse(res, result, "Deposit successfully");
    } catch (error) {
      next(error);
    }
  };

  // =========================================================
  // 13. START EXECUTING PHASE
  // =========================================================

  startExecutingPhase = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const result = await this.useCases.startExecutingPhase.execute({
        txHash: req.body.txHash,
        contractAddress: req.body.contractAddress,
      });

      return sendResponse(res, result, "Start executing phase successfully");
    } catch (error) {
      next(error);
    }
  };

  // =========================================================
  // 14. FINISH
  // =========================================================

  finish = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const result = await this.useCases.finish.execute({
        txHash: req.body.txHash,
        contractAddress: req.body.contractAddress,
      });

      return sendResponse(res, result, "Finish contract successfully");
    } catch (error) {
      next(error);
    }
  };

  // =========================================================
  // 15. GET CONTRACT DETAIL
  // =========================================================

  getContractDetail = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const contract = await this.useCases.getContractDetail.execute({
        contractId: req.params.id as string,
        authUser: req.user,
      });

      return sendResponse(res, contract);
    } catch (error) {
      next(error);
    }
  };

  // =========================================================
  // 16. GET CONTRACT LIST
  // =========================================================

  getContractList = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const query: ContractListQuery = {
        search: req.query.search as string,

        statuses: req.query.statuses
          ? Array.isArray(req.query.statuses)
            ? (req.query.statuses as ContractStatus[])
            : [req.query.statuses as ContractStatus]
          : [],

        page: Number(req.query.page ?? 1),

        limit: Number(req.query.limit ?? 10),
      };

      const result = await this.useCases.getContractList.execute({
        authUser: req.user,
        query,
      });

      return sendListResponse(res, result.items, result.pagination);
    } catch (error) {
      next(error);
    }
  };
}
