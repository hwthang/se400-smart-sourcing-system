// buyer-criteria.controller.ts

import { NextFunction, Response } from "express";

import { AuthRequest } from "../middlewares/authenticate.middleware";

import { sendResponse } from "../utils/response";

export class BuyerCriteriaController {
  constructor(private readonly useCases: any) {}

  createCriteria = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const criteria = await this.useCases.createCriteria.execute({
        ...req.body,
        authUser: req.user,
      });

      return sendResponse(
        res,
        criteria,
        "Create buyer criteria successfully",
        201,
      );
    } catch (error) {
      next(error);
    }
  };

  updateCriteria = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const criteria = await this.useCases.updateCriteria.execute({
        criteriaId: req.params.id,
        ...req.body,
        authUser: req.user,
      });

      return sendResponse(res, criteria, "Update buyer criteria successfully");
    } catch (error) {
      next(error);
    }
  };

  confirmCriteria = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const criteria = await this.useCases.confirmCriteria.execute({
        txHash: req.body.txHash,
        contractAddress: req.body.contractAddress,
      });

      return sendResponse(res, criteria, "Confirm buyer criteria successfully");
    } catch (error) {
      next(error);
    }
  };
}
