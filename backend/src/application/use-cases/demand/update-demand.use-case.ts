import { Demand } from "../../../domain/entities/demand.entity";
import { DemandStatus } from "../../../domain/enums/demand-status.enum";
import { UserRole } from "../../../domain/enums/user-role.enum";
import { DemandMapper } from "../../../infrastructure/persistence/mappers/demand.mapper";
import { AppError } from "../../../presentation/errors/app.error";
import { AuthUser } from "../../common/auth-user";
import { UpdateDemandDto } from "../../dtos/demand/update-demand.dto";
import { DemandRepository } from "../../repositories/demand.repo";

type UpdateDemandUseCaseRepos = {
  demandRepo: DemandRepository;
};

type UpdateDemandUseCaseInput = {
  authUser: AuthUser;
  demandId: string;
  dto: UpdateDemandDto;
};

export class UpdateDemandUseCase {
  constructor(private readonly repos: UpdateDemandUseCaseRepos) {}

  async execute(input: UpdateDemandUseCaseInput) {
    try {
      if (input.authUser.role !== UserRole.CUSTOMER) {
        throw new AppError("You are not authorized to update demands", 403);
      }

      const demand = await this.repos.demandRepo.findById(input.demandId);
      if (!demand) {
        throw new AppError("Demand not found", 404);
      }

      if (demand.customerId !== input.authUser.id) {
        throw new AppError("You can only update your own demands", 403);
      }

      console.log(input)

      demand.update(input.dto);
      const updatedDemand = await this.repos.demandRepo.save(demand);

      return DemandMapper.toDto(updatedDemand);
    } catch (error) {
      console.error("UpdateDemandUseCase error:", error);

      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        error instanceof Error ? error.message : "Failed to update demand",
        500,
      );
    }
  }
}
