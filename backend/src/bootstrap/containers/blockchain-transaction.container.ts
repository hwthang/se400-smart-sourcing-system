import { GetTransactionListUseCase } from "../../application/use-cases/blockchain-transaction/get-transaction-list.use-case";
import { GetContractDetailUseCase } from "../../application/use-cases/contract/get-contract-detail.use-case";
import { BlockchainTransactionController } from "../../presentation/controllers/blockchain-transaction.controller";
import { repositories } from "../repositories.bootstrap";

const { transactionRepo } = repositories;

const getTransactionList = new GetTransactionListUseCase({ transactionRepo });

export const blockchainTransactionController =
  new BlockchainTransactionController({
    getTransactionListUseCase: getTransactionList,
  });
