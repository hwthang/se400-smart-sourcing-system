// start-inspection.use-case.ts

import { AppError } from "../../../presentation/errors/app.error";

import { AuthUser } from "../../common/auth-user";

import { OrderRepository } from "../../repositories/order.repo";
import { SupplierRegistrationRepository } from "../../repositories/supplier-registration.repo";
import { ContractRepository } from "../../repositories/contract.repo";
import { DemandRepository } from "../../repositories/demand.repo";

type StartInspectionUseCaseRepos = {
  orderRepo: OrderRepository;
  registrationRepo: SupplierRegistrationRepository;
  contractRepo: ContractRepository;
  demandRepo: DemandRepository;
};

type StartInspectionInput = {
  orderId: string;
  authUser: AuthUser;
};

export class StartInspectionUseCase {
  constructor(
    private readonly repos: StartInspectionUseCaseRepos,
  ) {}

  async execute(
    input: StartInspectionInput,
  ) {
    const order =
      await this.repos.orderRepo.findById(
        input.orderId,
      );

    if (!order) {
      throw new AppError(
        "Order not found",
        404,
      );
    }

    const registration =
      await this.repos.registrationRepo.findById(
        order.registrationId,
      );

    if (!registration) {
      throw new AppError(
        "Registration not found",
        404,
      );
    }

    const contract =
      await this.repos.contractRepo.findById(
        registration.contractId,
      );

    if (!contract) {
      throw new AppError(
        "Contract not found",
        404,
      );
    }

    const demand =
      await this.repos.demandRepo.findById(
        contract.demandId,
      );

    if (!demand) {
      throw new AppError(
        "Demand not found",
        404,
      );
    }

    if (
      demand.assignedEmployeeId !==
      input.authUser.id
    ) {
      throw new AppError(
        "Forbidden",
        403,
      );
    }

    try {
      order.startInspection();

      await this.repos.orderRepo.save(
        order,
      );

      return order;
    } catch (error) {
      if (error instanceof Error) {
        throw new AppError(
          error.message,
          400,
        );
      }

      throw new AppError(
        "Failed to start inspection",
      );
    }
  }
}