import { Demand } from "../../../domain/entities/demand.entity";
import { UserRole } from "../../../domain/enums/user-role.enum";
import { DemandMapper } from "../../../infrastructure/persistence/mappers/demand.mapper";
import { AppError } from "../../../presentation/errors/app.error";
import { AuthUser } from "../../common/auth-user";
import { DemandRepository } from "../../repositories/demand.repo";

type AssignEmployeeUseCaseRepos = {
  demandRepo: DemandRepository;
};

export type AssignEmployeeUseCaseInput = {
  authUser: AuthUser;
  demandId: string;
};

export class AssignEmployeeUseCase {
  constructor(
    private readonly repos: AssignEmployeeUseCaseRepos,
  ) {}

  async execute(input: AssignEmployeeUseCaseInput) {
    try {
      const { authUser, demandId } = input;

      // Validate role
      if (authUser.role !== UserRole.EMPLOYEE) {
        throw new AppError(
          "Only employees can assign to demands",
          403,
        );
      }

      // Find demand
      const demand =
        await this.repos.demandRepo.findById(
          demandId,
        );

      if (!demand) {
        throw new AppError(
          "Demand not found",
          404,
        );
      }

      // Domain behavior
      demand.assignEmployee(authUser.id);

      const updatedDemand =
        await this.repos.demandRepo.save(
          demand,
        );

      return DemandMapper.toDto(
        updatedDemand,
      );
    } catch (error) {
      console.error(
        "AssignEmployeeUseCase error:",
        error,
      );

      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        error instanceof Error
          ? error.message
          : "Failed to assign employee to demand",
        500,
      );
    }
  }
}