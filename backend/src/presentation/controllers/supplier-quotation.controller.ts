// supplier-quotation.controller.ts

import { NextFunction, Response } from "express";

import { AuthRequest } from "../middlewares/authenticate.middleware";

import { sendListResponse, sendResponse } from "../utils/response";

export class SupplierQuotationController {
  constructor(private readonly useCases: any) {}

  createQuotation = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const quotation = await this.useCases.createQuotation.execute({
        ...req.body,
        authUser: req.user,
      });

      return sendResponse(res, quotation, "Create quotation successfully", 201);
    } catch (error) {
      next(error);
    }
  };

  updateQuotation = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const quotation = await this.useCases.updateQuotation.execute({
        quotationId: req.params.id,
        ...req.body,
        authUser: req.user,
      });

      return sendResponse(res, quotation, "Update quotation successfully");
    } catch (error) {
      next(error);
    }
  };

  submitQuotation = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const quotation = await this.useCases.submitQuotation.execute({
        quotationId: req.params.id,
        authUser: req.user,
      });

      return sendResponse(res, quotation, "Submit quotation successfully");
    } catch (error) {
      next(error);
    }
  };

  approveQuotation = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const quotation = await this.useCases.approveQuotation.execute({
        quotationId: req.params.id,
        authUser: req.user,
      });

      return sendResponse(res, quotation, "Approve quotation successfully");
    } catch (error) {
      next(error);
    }
  };

  rejectQuotation = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const quotation = await this.useCases.rejectQuotation.execute({
        quotationId: req.params.id,
        reason: req.body.reason,
        authUser: req.user,
      });

      return sendResponse(res, quotation, "Reject quotation successfully");
    } catch (error) {
      next(error);
    }
  };

  getQuotationDetail = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const quotation = await this.useCases.getQuotationDetail.execute({
        quotationId: req.params.id,
      });

      return sendResponse(res, quotation);
    } catch (error) {
      next(error);
    }
  };

  getQuotationList = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const result = await this.useCases.getQuotationList.execute({
        ...req.query,
      });

      return sendListResponse(res, result.items, result.meta);
    } catch (error) {
      next(error);
    }
  };

  confirmQuotation = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const quotation = await this.useCases.confirmQuotation.execute({
        txHash: req.body.txHash,
        contractAddress: req.body.contractAddress,
        authUser: req.user,
      });

      return sendResponse(res, quotation, "Confirm quotation successfully");
    } catch (error) {
      next(error);
    }
  };
}
