import { BlockchainTransactionMapper } from "../../../infrastructure/persistence/mappers/blockchain-transaction.mapper";
import { AuthUser } from "../../common/auth-user";
import { BlockchainTransactionRepository } from "../../repositories/blockchain-transaction.repo";

type GetTransactionListUseCaseRepos = {
  transactionRepo: BlockchainTransactionRepository;
};

type GetTransactionListUseCaseInput = {
  authUser: AuthUser;
  contractAddress: string;
};

export class GetTransactionListUseCase {
  constructor(private readonly repos: GetTransactionListUseCaseRepos) {}
  async execute(input: GetTransactionListUseCaseInput) {
    const transactions = await this.repos.transactionRepo.findByContractAddress(
      input.contractAddress,
    );

    return transactions.map(BlockchainTransactionMapper.toDto);
  }
}
