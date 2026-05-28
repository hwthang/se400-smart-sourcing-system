import { Contract } from "../../../domain/entities/contract.entity";
import { UserRole } from "../../../domain/enums/user-role.enum";
import { ContractMapper } from "../../../infrastructure/persistence/mappers/contract.mapper";
import { AppError } from "../../../presentation/errors/app.error";
import { AuthUser } from "../../common/auth-user";
import { ContractRepository } from "../../repositories/contract.repo";
import { DemandRepository } from "../../repositories/demand.repo";

type CreateContractRepos = {
  contractRepo: ContractRepository;
  demandRepo: DemandRepository;
};

export type CreateContractUseCaseInput = {
  authUser: AuthUser;
  demandId: string;
};

export class CreateContractUseCase {
  constructor(private readonly repos: CreateContractRepos) {}

  async execute(input: CreateContractUseCaseInput) {
    try {
      const { authUser, demandId } = input;

      if (authUser.role !== UserRole.EMPLOYEE) {
        throw new AppError(
          "You don't have permission to create contracts",
          403,
        );
      }

      const demand = await this.repos.demandRepo.findById(demandId);

      if (!demand) {
        throw new AppError("Demand not found", 404);
      }

      if (demand.assignedEmployeeId !== authUser.id) {
        throw new AppError(
          "Only the assigned employee can create contracts for this demand",
          403,
        );
      }

      const contract = Contract.create({ demandId });

      demand.markContracted();

      await this.repos.demandRepo.save(demand)

      const savedContract = await this.repos.contractRepo.save(contract);

      return ContractMapper.toDto(savedContract);
    } catch (error) {
      console.error("CreateContractUseCase error:", error);

      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        error instanceof Error ? error.message : "Failed to create contract",
        500,
      );
    }
  }
}
