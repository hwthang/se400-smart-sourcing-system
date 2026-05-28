// confirm-order.use-case.ts

import { AppError } from "../../../presentation/errors/app.error";

import { AuthUser } from "../../common/auth-user";

import { OrderRepository } from "../../repositories/order.repo";
import { SupplierRegistrationRepository } from "../../repositories/supplier-registration.repo";

type ConfirmOrderUseCaseRepos = {
  orderRepo: OrderRepository;
  registrationRepo: SupplierRegistrationRepository;
};

type ConfirmOrderInput = {
  orderId: string;
  authUser: AuthUser;
};

export class ConfirmOrderUseCase {
  constructor(
    private readonly repos: ConfirmOrderUseCaseRepos,
  ) {}

  async execute(
    input: ConfirmOrderInput,
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

    if (
      registration.supplierId !==
      input.authUser.id
    ) {
      throw new AppError(
        "Forbidden",
        403,
      );
    }

    try {
      order.confirm();

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
        "Failed to confirm order",
      );
    }
  }
}