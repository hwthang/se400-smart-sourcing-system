// demand.container.ts

import { repositories } from "../repositories.bootstrap";

import { DemandController } from "../../presentation/controllers/demand.controller";

import { CreateDemandUseCase } from "../../application/use-cases/demand/create-demand.use-case";
import { UpdateDemandUseCase } from "../../application/use-cases/demand/update-demand.use-case";

import { SubmitDemandUseCase } from "../../application/use-cases/demand/submit-demand.use-case";

import { ApproveDemandUseCase } from "../../application/use-cases/demand/approve-demand.use-case";
import { RejectDemandUseCase } from "../../application/use-cases/demand/reject-demand.use-case";

import { AssignEmployeeUseCase } from "../../application/use-cases/demand/assign-employee.use-case";

import { GetDemandDetailUseCase } from "../../application/use-cases/demand/get-demand-detail.use-case";
import { GetDemandListUseCase } from "../../application/use-cases/demand/get-demand-list.use-case";
import { ConfirmDemandUseCase } from "../../application/use-cases/demand/confirm-demand.use-case";

// =========================================================
// REPOSITORIES
// =========================================================

const { demandRepo, userRepo, contractRepo } = repositories;

// =========================================================
// USE CASES
// =========================================================

const createDemandUseCase = new CreateDemandUseCase({
  demandRepo,
});

const updateDemandUseCase = new UpdateDemandUseCase({
  demandRepo,
});

const submitDemandUseCase = new SubmitDemandUseCase({
  demandRepo,
});

const approveDemandUseCase = new ApproveDemandUseCase({
  demandRepo,
});

const rejectDemandUseCase = new RejectDemandUseCase({
  demandRepo,
});

const assignEmployeeUseCase = new AssignEmployeeUseCase({
  demandRepo,
});

const getDemandDetailUseCase = new GetDemandDetailUseCase({
  demandRepo,
  userRepo,
  contractRepo
});

const getDemandListUseCase = new GetDemandListUseCase({ demandRepo, userRepo });

const confirmDemandUseCase = new ConfirmDemandUseCase({
  contractRepo,
  demandRepo,
});

// =========================================================
// CONTROLLER
// =========================================================

export const demandController = new DemandController({
  createDemand: createDemandUseCase,

  updateDemand: updateDemandUseCase,

  submitDemand: submitDemandUseCase,

  approveDemand: approveDemandUseCase,

  rejectDemand: rejectDemandUseCase,

  assignEmployee: assignEmployeeUseCase,

  getDemandDetail: getDemandDetailUseCase,

  getDemandList: getDemandListUseCase,

  confirmDemand: confirmDemandUseCase,
});
