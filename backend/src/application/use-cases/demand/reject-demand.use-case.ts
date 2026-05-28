import { Demand } from "../../../domain/entities/demand.entity";
import { UserRole } from "../../../domain/enums/user-role.enum";
import { DemandMapper } from "../../../infrastructure/persistence/mappers/demand.mapper";
import { AppError } from "../../../presentation/errors/app.error";
import { AuthUser } from "../../common/auth-user";
import { DemandRepository } from "../../repositories/demand.repo";

type RejectDemandUseCaseRepos = {
  demandRepo: DemandRepository;
};

type RejectDemandUseCaseInput = {
  authUser: AuthUser;
  demandId: string;
  reason: string;
};

export class RejectDemandUseCase {
  constructor(private readonly repos: RejectDemandUseCaseRepos) {}

  async execute(input: RejectDemandUseCaseInput) {
    try {
      console.log(input);
      // Validate user role
      if (input.authUser.role !== UserRole.EMPLOYEE) {
        throw new AppError("You are not authorized to reject demands", 403);
      }

      // Validate reason
      if (!input.reason || input.reason.trim().length === 0) {
        throw new AppError("Rejection reason is required", 400);
      }

      // Find demand
      const demand = await this.repos.demandRepo.findById(input.demandId);
      if (!demand) {
        throw new AppError("Demand not found", 404);
      }

      // Reject demand
      demand.reject(input.reason);
      const updatedDemand = await this.repos.demandRepo.save(demand);
      console.log(updatedDemand)

      return DemandMapper.toDto(updatedDemand);
    } catch (error) {
      console.error("RejectDemandUseCase error:", error);

      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        error instanceof Error ? error.message : "Failed to reject demand",
        500,
      );
    }
  }
}
