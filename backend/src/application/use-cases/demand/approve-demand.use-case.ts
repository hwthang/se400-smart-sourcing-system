import { Demand } from "../../../domain/entities/demand.entity";
import { UserRole } from "../../../domain/enums/user-role.enum";
import { DemandMapper } from "../../../infrastructure/persistence/mappers/demand.mapper";
import { AppError } from "../../../presentation/errors/app.error";
import { AuthUser } from "../../common/auth-user";
import { DemandRepository } from "../../repositories/demand.repo";

type ApproveDemandUseCaseRepos = {
  demandRepo: DemandRepository;
};
type ApproveDemandUseCaseInput = {
  authUser: AuthUser;
  demandId: string;
};
export class ApproveDemandUseCase {
  constructor(private readonly repos: ApproveDemandUseCaseRepos) {}

  async execute(input: ApproveDemandUseCaseInput) {
    try {
      // Validate user role (only approver/manager can approve)
      if (input.authUser.role !== UserRole.EMPLOYEE) {
        throw new AppError("You are not authorized to approve demands", 403);
      }

      // Find demand
      const demand = await this.repos.demandRepo.findById(input.demandId);
      if (!demand) {
        throw new AppError("Demand not found", 404);
      }

      // Approve demand
      demand.approve();
      const updatedDemand = await this.repos.demandRepo.save(demand);

      return DemandMapper.toDto(updatedDemand);
    } catch (error) {
      console.error("ApproveDemandUseCase error:", error);

      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        error instanceof Error ? error.message : "Failed to approve demand",
        500,
      );
    }
  }
}
