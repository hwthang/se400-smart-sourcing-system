import { ContractMapper } from "../../../infrastructure/persistence/mappers/contract.mapper";
import { AppError } from "../../../presentation/errors/app.error";
import { AuthUser } from "../../common/auth-user";
import {
  ContractListQuery,
  ContractRepository,
} from "../../repositories/contract.repo";

type GetContractListRepos = {
  contractRepo: ContractRepository;
};

export type GetContractListUseCaseInput = {
  authUser: AuthUser;
  query: ContractListQuery;
};

export class GetContractListUseCase {
  constructor(private readonly repos: GetContractListRepos) {}

  async execute(input: GetContractListUseCaseInput) {
    try {
      const { authUser, query } = input;

      const result = await this.repos.contractRepo.getList(authUser, query);

      return { ...result, items: result.items.map(ContractMapper.toDto) };
    } catch (error) {
      console.error("GetContractListUseCase error:", error);

      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        error instanceof Error ? error.message : "Failed to get contract list",
        500,
      );
    }
  }
}
