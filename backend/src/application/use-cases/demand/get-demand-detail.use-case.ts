// application/use-cases/demand/get-demand-detail.use-case.ts

import { AppError } from "../../../presentation/errors/app.error";

import { DemandMapper } from "../../../infrastructure/persistence/mappers/demand.mapper";

import { DemandRepository } from "../../repositories/demand.repo";
import { UserRepository } from "../../repositories/user.repo";
import { UserMapper } from "../../../infrastructure/persistence/mappers/user.mapper";
import { ContractRepository } from "../../repositories/contract.repo";
import { ContractMapper } from "../../../infrastructure/persistence/mappers/contract.mapper";

type GetDemandDetailUseCaseRepos = {
  demandRepo: DemandRepository;
  userRepo: UserRepository;
  contractRepo: ContractRepository;
};

type ExecuteParams = {
  demandId: string;
};

export class GetDemandDetailUseCase {
  constructor(private readonly repos: GetDemandDetailUseCaseRepos) {}

  async execute(params: ExecuteParams) {
    try {
      const demand = await this.repos.demandRepo.findById(params.demandId);

      if (!demand) {
        throw new AppError("Demand not found", 404);
      }

      const customer = await this.repos.userRepo.findById(demand.customerId);
      if (!customer) {
        throw new AppError("Customer not found", 404);
      }

      const contract = await this.repos.contractRepo.findByDemandId(demand.id!);

      return {
        ...DemandMapper.toDto(demand),
        customer: UserMapper.toDto(customer),
        contract: contract ? ContractMapper.toDto(contract) : undefined,
      };
    } catch (error) {
      console.error("GetDemandDetailUseCase error:", error);

      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        error instanceof Error ? error.message : "Failed to get demand detail",
        500,
      );
    }
  }
}
