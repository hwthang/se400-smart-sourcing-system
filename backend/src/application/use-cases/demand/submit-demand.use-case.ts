import { UserRole } from "../../../domain/enums/user-role.enum";
import { DemandMapper } from "../../../infrastructure/persistence/mappers/demand.mapper";
import { AppError } from "../../../presentation/errors/app.error";
import { AuthUser } from "../../common/auth-user";
import { DemandRepository } from "../../repositories/demand.repo";

type SubmitDemandUseCaseRepos = {
  demandRepo: DemandRepository;
};

type SubmitDemandUseCaseInput = {
  authUser: AuthUser;
  demandId: string;
};

export class SubmitDemandUseCase {
  constructor(private readonly repos: SubmitDemandUseCaseRepos) {}

  async execute(input: SubmitDemandUseCaseInput) {
    try {
      // Validate user role
      if (input.authUser.role !== UserRole.CUSTOMER) {
        throw new AppError("Only customers can submit demands", 403);
      }

      // Find demand
      const demand = await this.repos.demandRepo.findById(input.demandId);
      if (!demand) {
        throw new AppError("Demand not found", 404);
      }

      // Verify customer owns this demand
      if (demand.customerId !== input.authUser.id) {
        throw new AppError("You can only submit your own demands", 403);
      }

      demand.submit();
      const updatedDemand = await this.repos.demandRepo.save(demand);

      return DemandMapper.toDto(updatedDemand);
    } catch (error) {
      console.error("SubmitDemandUseCase error:", error);

      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        error instanceof Error ? error.message : "Failed to submit demand",
        500,
      );
    }
  }
}
