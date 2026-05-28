// demand.controller.ts

import { NextFunction, Response } from "express";

import { AuthRequest } from "../middlewares/authenticate.middleware";

import { sendListResponse, sendResponse } from "../utils/response";

import { CreateDemandUseCase } from "../../application/use-cases/demand/create-demand.use-case";

import { UpdateDemandUseCase } from "../../application/use-cases/demand/update-demand.use-case";

import { SubmitDemandUseCase } from "../../application/use-cases/demand/submit-demand.use-case";

import { ApproveDemandUseCase } from "../../application/use-cases/demand/approve-demand.use-case";

import { RejectDemandUseCase } from "../../application/use-cases/demand/reject-demand.use-case";

import { AssignEmployeeUseCase } from "../../application/use-cases/demand/assign-employee.use-case";

import { GetDemandDetailUseCase } from "../../application/use-cases/demand/get-demand-detail.use-case";

import { GetDemandListUseCase } from "../../application/use-cases/demand/get-demand-list.use-case";

import { DemandStatus } from "../../domain/enums/demand-status.enum";
import { CreateDemandDto } from "../../application/dtos/demand/create-demand.dto";
import { AuthUser } from "../../application/common/auth-user";
import { ConfirmDemandUseCase } from "../../application/use-cases/demand/confirm-demand.use-case";

type DemandControllerUseCases = {
  createDemand: CreateDemandUseCase;

  updateDemand: UpdateDemandUseCase;

  submitDemand: SubmitDemandUseCase;

  approveDemand: ApproveDemandUseCase;

  rejectDemand: RejectDemandUseCase;

  assignEmployee: AssignEmployeeUseCase;

  confirmDemand: ConfirmDemandUseCase;

  getDemandDetail: GetDemandDetailUseCase;

  getDemandList: GetDemandListUseCase;
};

export class DemandController {
  constructor(private readonly useCases: DemandControllerUseCases) {}

  createDemand = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const demand = await this.useCases.createDemand.execute({
        authUser: req.user as AuthUser,
        dto: req.body as CreateDemandDto,
      });

      return sendResponse(res, demand, "Create demand successfully", 201);
    } catch (error) {
      next(error);
    }
  };

  updateDemand = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const demand = await this.useCases.updateDemand.execute({
        demandId: req.params.id as string,
        dto: req.body,
        authUser: req.user,
      });

      return sendResponse(res, demand, "Update demand successfully");
    } catch (error) {
      next(error);
    }
  };

  submitDemand = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const demand = await this.useCases.submitDemand.execute({
        demandId: req.params.id as string,
        authUser: req.user as AuthUser,
      });

      return sendResponse(res, demand, "Submit demand successfully");
    } catch (error) {
      next(error);
    }
  };

  approveDemand = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const demand = await this.useCases.approveDemand.execute({
        demandId: req.params.id as string,
        authUser: req.user as AuthUser,
      });

      return sendResponse(res, demand, "Approve demand successfully");
    } catch (error) {
      next(error);
    }
  };

  rejectDemand = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      console.log(req.body.reason);
      const demand = await this.useCases.rejectDemand.execute({
        demandId: req.params.id as string,
        reason: req.body.reason,
        authUser: req.user,
      });

      return sendResponse(res, demand, "Reject demand successfully");
    } catch (error) {
      next(error);
    }
  };

  assignEmployee = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const demand = await this.useCases.assignEmployee.execute({
        demandId: req.params.id as string,
        authUser: req.user,
      });

      return sendResponse(res, demand, "Assign employee successfully");
    } catch (error) {
      next(error);
    }
  };

  confirmDemand = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const demand = await this.useCases.confirmDemand.execute({
        id: req.params.id as string,
        txHash: req.body.txHash,
        contractAddress: req.body.contractAddress,
      });

      return sendResponse(res, demand, "Assign employee successfully");
    } catch (error) {
      next(error);
    }
  };

  getDemandDetail = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const demand = await this.useCases.getDemandDetail.execute({
        demandId: req.params.id as string,
      });

      return sendResponse(res, demand);
    } catch (error) {
      next(error);
    }
  };

  getDemandList = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const result = await this.useCases.getDemandList.execute(req.user, {
        search: req.query.search as string,

        statuses: req.query.statuses
          ? (req.query.statuses as string)
              .split(",")
              .map((status) => status as DemandStatus)
          : [],

        page: Number(req.query.page || 1),

        limit: Number(req.query.limit || 10),
      });

      return sendListResponse(res, result.items, result.pagination);
    } catch (error) {
      next(error);
    }
  };
}
