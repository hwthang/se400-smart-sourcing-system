// supplier-registration.controller.ts

import { NextFunction, Response } from "express";

import { AuthRequest } from "../middlewares/authenticate.middleware";

import { sendResponse } from "../utils/response";
import { AuthUser } from "../../application/common/auth-user";

export class SupplierRegistrationController {
  constructor(private readonly useCases: any) {}

  createRegistration = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const registration = await this.useCases.createRegistration.execute({
        contractId: req.body.contractId,
        authUser: req.user as AuthUser,
      });

      return sendResponse(
        res,
        registration,
        "Create registration successfully",
        201,
      );
    } catch (error) {
      next(error);
    }
  };

  confirmRegistration = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const registration = await this.useCases.confirmRegistration.execute({
        registrationId: req.params.id,
        authUser: req.user,
      });

      return sendResponse(
        res,
        registration,
        "Confirm registration successfully",
      );
    } catch (error) {
      next(error);
    }
  };

  cancelRegistration = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const registration = await this.useCases.cancelRegistration.execute({
        registrationId: req.params.id,
        authUser: req.user,
        reason: req.body.reason
      });

      return sendResponse(
        res,
        registration,
        "Cancel registration successfully",
      );
    } catch (error) {
      next(error);
    }
  };
}
