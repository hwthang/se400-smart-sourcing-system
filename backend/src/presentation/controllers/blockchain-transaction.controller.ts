import { NextFunction, Response } from "express";
import { GetTransactionListUseCase } from "../../application/use-cases/blockchain-transaction/get-transaction-list.use-case";
import { AuthRequest } from "../middlewares/authenticate.middleware";
import { AuthUser } from "../../application/common/auth-user";
import { sendResponse } from "../utils/response";

type BlockchainTransactionControllerUseCases = {
  getTransactionListUseCase: GetTransactionListUseCase;
};

export class BlockchainTransactionController {
  constructor(
    private readonly useCases: BlockchainTransactionControllerUseCases,
  ) {}

  getTransactionList = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const result = await this.useCases.getTransactionListUseCase.execute({
        authUser: req.user as AuthUser,
        contractAddress: req.query.contractAddress as string,
      });
      return sendResponse(res, result, "Get transaction list successfully", 200);
    } catch (error) {
      next(error);
    }
  };
}
