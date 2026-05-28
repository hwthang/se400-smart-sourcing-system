// order.controller.ts

import { NextFunction, Response } from "express";

import { AuthRequest } from "../middlewares/authenticate.middleware";

import { sendResponse } from "../utils/response";

export class OrderController {
  constructor(private readonly useCases: any) {}

  confirmOrder = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const order = await this.useCases.confirmOrder.execute({
        orderId: req.params.id,
        authUser: req.user,
      });

      return sendResponse(res, order, "Confirm order successfully");
    } catch (error) {
      next(error);
    }
  };

  startDelivery = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const order = await this.useCases.startDelivery.execute({
        orderId: req.params.id,
        authUser: req.user,
      });

      return sendResponse(res, order, "Start delivery successfully");
    } catch (error) {
      next(error);
    }
  };

  startInspection = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const order = await this.useCases.startInspection.execute({
        orderId: req.params.id,
        authUser: req.user,
      });

      return sendResponse(res, order, "Start inspection successfully");
    } catch (error) {
      next(error);
    }
  };

  completeDelivery = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const order = await this.useCases.completeDelivery.execute({
        txHash: req.body.txHash,
        contractAddress: req.body.contractAddress,
      });

      return sendResponse(res, order, "Complete delivery successfully");
    } catch (error) {
      next(error);
    }
  };

  completeInspection = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const order = await this.useCases.completeInspection.execute({
        txHash: req.body.txHash,
        contractAddress: req.body.contractAddress,
      });

      return sendResponse(res, order, "Complete inspection successfully");
    } catch (error) {
      next(error);
    }
  };

  releaseSupplierPayment = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const result = await this.useCases.releaseSupplierPayment.execute({
         txHash: req.body.txHash,
        contractAddress: req.body.contractAddress,
      });

      return sendResponse(res, result, "Release supplier payment successfully");
    } catch (error) {
      next(error);
    }
  };
}
