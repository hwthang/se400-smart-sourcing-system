import { Demand } from "../../../domain/entities/demand.entity";
import { UserRole } from "../../../domain/enums/user-role.enum";
import { DemandMapper } from "../../../infrastructure/persistence/mappers/demand.mapper";
import { AppError } from "../../../presentation/errors/app.error";
import { AuthUser } from "../../common/auth-user";
import { CreateDemandDto } from "../../dtos/demand/create-demand.dto";
import { DemandRepository } from "../../repositories/demand.repo";

type CreateDemandUseCaseRepos = {
  demandRepo: DemandRepository;
};
type CreateDemandUseCaseInput = {
  authUser: AuthUser;
  dto: CreateDemandDto;
};

export class CreateDemandUseCase {
  constructor(private readonly repos: CreateDemandUseCaseRepos) {}

  async execute(input: CreateDemandUseCaseInput) {
    try {
      if (input.authUser.role !== UserRole.CUSTOMER) {
        throw new AppError("Only customers can create demands", 403);
      }

      if (!input.dto.requestedQuantity || input.dto.requestedQuantity <= 0) {
        throw new AppError("Requested quantity must be greater than 0", 400);
      }
      if (
        !input.dto.requestedDeliveryDate ||
        new Date(input.dto.requestedDeliveryDate).getTime() <=
          new Date().getTime()
      ) {
        throw new AppError("Delivery date must be in the future", 400);
      }

      const demand = Demand.create({
        ...input.dto,
        customerId: input.authUser.id,
      });

      const savedDemand = await this.repos.demandRepo.save(demand);

      return DemandMapper.toDto(savedDemand);
    } catch (error) {
      console.error("CreateDemandUseCase error:", error);

      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        error instanceof Error ? error.message : "Failed to create demand",
        500,
      );
    }
  }
}
