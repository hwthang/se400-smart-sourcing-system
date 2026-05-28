import { UserRole } from "../../../domain/enums/user-role.enum";
import { ContractStatus } from "../../../domain/enums/contract-status.enum";
import { ContractMapper } from "../../../infrastructure/persistence/mappers/contract.mapper";
import { AppError } from "../../../presentation/errors/app.error";
import { AuthUser } from "../../common/auth-user";
import { ContractRepository } from "../../repositories/contract.repo";
import { DemandRepository } from "../../repositories/demand.repo";
import { SourcingSystemService } from "../../../infrastructure/blockchain/services/sourcing-system.service";
import { UserRepository } from "../../repositories/user.repo";
import { ethers } from "ethers";

type DeployContractRepos = {
  contractRepo: ContractRepository;
  demandRepo: DemandRepository;
  userRepo: UserRepository;
};

type DeployContractUseCaseInput = {
  authUser: AuthUser;
  contractId: string;
};

export class DeployContractUseCase {
  constructor(
    private readonly repos: DeployContractRepos,
    private readonly sourcingSystemService: SourcingSystemService,
  ) {}

  async execute(input: DeployContractUseCaseInput) {
    try {
      const { authUser, contractId } = input;

      if (authUser.role !== UserRole.EMPLOYEE) {
        throw new AppError(
          "You don't have permission to deploy contracts",
          403,
        );
      }

      const contract = await this.repos.contractRepo.findById(contractId);

      if (!contract) {
        throw new AppError("Contract not found", 404);
      }

      if (contract.status !== ContractStatus.SUPPLIER_REGISTRATION_CLOSED) {
        throw new AppError(
          `Cannot deploy contract in ${contract.status} status`,
          400,
        );
      }

      const demand = await this.repos.demandRepo.findById(contract.demandId);

      if (!demand) {
        throw new AppError("Demand not found", 404);
      }

      if (demand.assignedEmployeeId !== authUser.id) {
        throw new AppError(
          "Only the assigned employee can deploy this contract",
          403,
        );
      }

      const employee = await this.repos.userRepo.findById(
        demand.assignedEmployeeId,
      );

      if (!employee) {
        throw new AppError("Employee not found", 404);
      }

      if (!employee.walletAddress) {
        throw new AppError("Employee wallet address is required", 400);
      }

      // ================= DOMAIN ACTION =================

      const externalId = ethers.id(contract.id!);

      // ================= BLOCKCHAIN SIDE EFFECT =================
      const receipt =
        await this.sourcingSystemService.createProcurementContract({
          externalId,

          buyer: ethers.getAddress(employee.walletAddress),

          priceWeight: contract.evaluationWeights.price,

          defectWeight: contract.evaluationWeights.defect,

          leadTimeWeight: contract.evaluationWeights.leadTime,

          delayPenaltyRate: contract.penaltyRates.delay,

          defectPenaltyRate: contract.penaltyRates.defect,
        });

      contract.deploy(externalId, receipt.contractAddress);

      const updatedContract = await this.repos.contractRepo.save(contract);

      return ContractMapper.toDto(updatedContract);
    } catch (error) {
      console.error("DeployContractUseCase error:", error);

      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        error instanceof Error ? error.message : "Failed to deploy contract",
        500,
      );
    }
  }
}
