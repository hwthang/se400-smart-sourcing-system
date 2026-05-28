// application/use-cases/demand/get-demand-list.use-case.ts

import { AppError } from "../../../presentation/errors/app.error";

import { AuthUser } from "../../common/auth-user";

import {
  DemandListQuery,
  DemandListResult,
  DemandRepository,
} from "../../repositories/demand.repo";

import { DemandMapper } from "../../../infrastructure/persistence/mappers/demand.mapper";
import { UserRepository } from "../../repositories/user.repo";
import { UserRole } from "../../../domain/enums/user-role.enum";
import { UserMapper } from "../../../infrastructure/persistence/mappers/user.mapper";

type GetDemandListUseCaseRepos = {
  demandRepo: DemandRepository;
  userRepo: UserRepository;
};

export class GetDemandListUseCase {
  constructor(private readonly repos: GetDemandListUseCaseRepos) {}

  async execute(authUser: AuthUser, query: DemandListQuery) {
    try {
      const result = await this.repos.demandRepo.getList(authUser, query);

      const items = await Promise.all(
        result.items.map(async (item) => {
          const customer = await this.repos.userRepo.findById(item.customerId);
          if (!customer) throw new AppError("Customer not found", 404);
          return {
            ...DemandMapper.toDto(item),
            customer: {
              ...UserMapper.toDto(customer),
              walletAddress: undefined,
              role: undefined,
              isActive: undefined,
              createdAt: undefined,
              updatedAt: undefined,
            },
            customerId: undefined,
          };
        }),
      );

      return {
        items,

        pagination: result.pagination,
      };
    } catch (error) {
      console.error("GetDemandListUseCase error:", error);

      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        error instanceof Error ? error.message : "Failed to get demand list",
        500,
      );
    }
  }
}
