import { UserRole } from "../../../domain/enums/user-role.enum";
import { AppError } from "../../../presentation/errors/app.error";
import { AuthUser } from "../../common/auth-user";
import { ContractRepository } from "../../repositories/contract.repo";
import { DemandRepository } from "../../repositories/demand.repo";
import { OrderRepository } from "../../repositories/order.repo";
import { SupplierRegistrationRepository } from "../../repositories/supplier-registration.repo";
import { Order } from "../../../domain/entities/order.entity";
import { SupplierRegistrationStatus } from "../../../domain/enums/supplier-registration-status.enum";
import {
  AllocationService,
  ContractData,
  SupplierData,
} from "../../services/allocation.service";
import { SupplierQuotation } from "../../../domain/entities/supplier-quotation.entity";
import { SupplierQuotationRepository } from "../../repositories/supplier-quotation.repo";
import { BuyerCriteria } from "../../../domain/entities/buyer-criteria.entity";
import { BuyerCriteriaRepository } from "../../repositories/buyer-criteria.repo";
import { ProcurementContractService } from "../../../infrastructure/blockchain/services/procurement-contract.service";
import { UserRepository } from "../../repositories/user.repo";
import { ethers } from "ethers";
import { PrecisionHelper } from "../../../utils/precision-helper";
import { BlockchainTransaction } from "../../../domain/entities/blockchain-transaction.entity";
import { BlockchainTransactionRepository } from "../../repositories/blockchain-transaction.repo";

type RunAllocationRepos = {
  contractRepo: ContractRepository;
  demandRepo: DemandRepository;
  quotationRepo: SupplierQuotationRepository;
  criteriaRepo: BuyerCriteriaRepository;
  orderRepo: OrderRepository;
  registrationRepo: SupplierRegistrationRepository;
  userRepo: UserRepository;
  transactionRepo: BlockchainTransactionRepository;
};

type RunAllocationUseCaseInput = {
  authUser: AuthUser;
  contractId: string;
};

type RunAllocationUseCaseServices = {
  allocationService: AllocationService;
};

export class RunAllocationUseCase {
  constructor(
    private readonly repos: RunAllocationRepos,
    private readonly services: RunAllocationUseCaseServices,
  ) {}

  async execute(input: RunAllocationUseCaseInput) {
    try {
      const { authUser, contractId } = input;

      if (authUser.role !== UserRole.EMPLOYEE) {
        throw new AppError("You don't have permission to run allocation", 403);
      }

      const contract = await this.repos.contractRepo.findById(contractId);

      if (!contract) {
        throw new AppError("Contract not found", 404);
      }

      const demand = await this.repos.demandRepo.findById(contract.demandId);

      if (!demand) {
        throw new AppError("Demand not found", 404);
      }

      if (demand.assignedEmployeeId !== authUser.id) {
        throw new AppError(
          "Only the assigned employee can run allocation for this contract",
          403,
        );
      }

      // Get all confirmed registrations for this contract
      const registrations =
        await this.repos.registrationRepo.findAllByContractId(contractId);

      const confirmedRegistrations = registrations.filter(
        (reg) => reg.status === SupplierRegistrationStatus.CONFIRMED,
      );

      if (confirmedRegistrations.length === 0) {
        throw new AppError(
          "No confirmed registrations found for allocation",
          400,
        );
      }

      const contractData: ContractData = {
        Q: demand.requestedQuantity,
        priceW: +Number(contract.evaluationWeights.price / 100).toFixed(4),

        leadTimeW: +Number(contract.evaluationWeights.leadTime / 100).toFixed(
          4,
        ),

        defectW: +Number(contract.evaluationWeights.defect / 100).toFixed(4),
      };

      console.log(contractData);

      const quotations =
        await this.repos.quotationRepo.findAllQuotationsOfContract(
          contract.id!,
        );

      const quotationMap = quotations.reduce(
        (acc, item) => {
          acc[item.registrationId] = {
            ...item,
            registrationId: undefined,
          };

          return acc;
        },
        {} as Record<string, any>,
      );

      const criteria = await this.repos.criteriaRepo.findAllCriteriaOfContract(
        contract.id!,
      );

      const criteriaMap = criteria.reduce(
        (acc, item) => {
          acc[item.registrationId] = {
            ...item,
            registrationId: undefined,
          };

          return acc;
        },
        {} as Record<string, any>,
      );

      const suppliers = await Promise.all(
        registrations.map(async (item) => {
          const supplier = await this.repos.userRepo.findById(item.supplierId);
          return { registrationId: item.id, supplier: supplier?.walletAddress };
        }),
      );

      const supplierMap = suppliers.reduce(
        (acc, item) => {
          acc[item.registrationId!] = {
            ...item,
            registrationId: undefined,
          };

          return acc;
        },
        {} as Record<string, any>,
      );

      const supplierData: SupplierData[] = registrations.map((item) => {
        const criteria = criteriaMap[item.id!];
        const quotation = quotationMap[item.id!];

        return {
          registrationId: item.id!,
          P: quotation?._unitPrice,
          reversedP: 0,
          L: quotation?._maxLeadTimeDays,
          reversedL: 0,
          R: +Number(quotation?._maxDefectRate / 100).toFixed(4),
          reversedR: 0,
          S: 0,
          minQS: quotation?._minSupplyQuantity,
          maxQS: quotation?._maxSupplyQuantity,
          minQB: criteria?._minPurchaseQuantity,
          c: +Number(criteria?._maxAllocationPercent / 100).toFixed(4),

          minQ: 0,
          Q: 0,
          estimatedAmount: 0,
        };
      });

      const allocationResult = this.services.allocationService.execute(
        supplierData,
        contractData,
      );

      const onChainService = ProcurementContractService.create(
        contract.address,
      );
      const sleep = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

      for (const order of allocationResult.orders) {
        try {
          const supplier = supplierMap[order.registrationId]?.supplier;

          if (!supplier) {
            console.warn("Missing supplier:", order.registrationId);
            continue;
          }

          const allocationScore = Math.max(
            0,
            Math.min(65535, Math.round(Number(order.allocationScore))),
          );

          const result = await onChainService.createOrder({
            supplier,
            allocationScore,
            allocatedQuantity: order.assignedQuantity,
            estimatedAmount: order.estimatedAmount,
          });

          if (result.status === 1) {
            order.confirm();
            const transaction = BlockchainTransaction.create({
              txHash: result.txHash,
              contractAddress: contract.address,
              method: "CREATE_ORDER",
              status: result?.status == 1 ? "CONFIRMED" : "FAILED",
            });
            await this.repos.transactionRepo.create(transaction);
          }

          await this.repos.orderRepo.save(order);

          // ⛔ IMPORTANT: delay 3s giữa mỗi tx
          await sleep(5000);
        } catch (err) {
          console.log("createOrder failed:", err);

          // vẫn delay để tránh spam fail
          await sleep(3000);
        }
      }
      contract.markAllocated(allocationResult.requiredDepositedAmount);
      console.log(allocationResult.requiredDepositedAmount);
      await this.repos.contractRepo.save(contract);
    } catch (error) {
      console.error("RunAllocationUseCase error:", error);

      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        error instanceof Error ? error.message : "Failed to run allocation",
        500,
      );
    }
  }
}
