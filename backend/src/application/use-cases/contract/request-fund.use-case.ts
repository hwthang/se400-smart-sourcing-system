import { UserRole } from "../../../domain/enums/user-role.enum";
import { ContractStatus } from "../../../domain/enums/contract-status.enum";
import { ContractMapper } from "../../../infrastructure/persistence/mappers/contract.mapper";
import { AppError } from "../../../presentation/errors/app.error";
import { AuthUser } from "../../common/auth-user";
import { ContractRepository } from "../../repositories/contract.repo";
import { DemandRepository } from "../../repositories/demand.repo";

type RequestFundRepos = {
  contractRepo: ContractRepository;
  demandRepo: DemandRepository;
};

type RequestFundUseCaseInput = {
  authUser: AuthUser;
  contractId: string;
};

export class RequestFundUseCase {
  constructor(private readonly repos: RequestFundRepos) {}

  async execute(input: RequestFundUseCaseInput) {
    try {
      const { authUser, contractId } = input;

      if (authUser.role !== UserRole.EMPLOYEE) {
        throw new AppError("You don't have permission to request fund", 403);
      }

      const contract = await this.repos.contractRepo.findById(contractId);

      if (!contract) {
        throw new AppError("Contract not found", 404);
      }

      if (contract.status !== ContractStatus.ALLOCATED) {
        throw new AppError(
          `Cannot request fund in ${contract.status} status`,
          400,
        );
      }

      const demand = await this.repos.demandRepo.findById(contract.demandId);

      if (!demand) {
        throw new AppError("Demand not found", 404);
      }

      if (demand.assignedEmployeeId !== authUser.id) {
        throw new AppError(
          "Only the assigned employee can request fund for this contract",
          403,
        );
      }

      // ================= DOMAIN ACTION =================
      contract.requestFunding();

      const updatedContract = await this.repos.contractRepo.save(contract);

      return ContractMapper.toDto(updatedContract);
    } catch (error) {
      console.error("RequestFundUseCase error:", error);

      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        error instanceof Error ? error.message : "Failed to request fund",
        500,
      );
    }
  }
}
