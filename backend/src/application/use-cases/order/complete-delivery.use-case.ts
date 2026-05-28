import { ProcurementContractService } from "../../../infrastructure/blockchain/services/procurement-contract.service";
import { ContractMapper } from "../../../infrastructure/persistence/mappers/contract.mapper";
import { OrderMapper } from "../../../infrastructure/persistence/mappers/order.mapper";
import { BuyerCriteriaRepository } from "../../repositories/buyer-criteria.repo";
import { ContractRepository } from "../../repositories/contract.repo";
import { OrderRepository } from "../../repositories/order.repo";
import { SupplierRegistrationRepository } from "../../repositories/supplier-registration.repo";
import { UserRepository } from "../../repositories/user.repo";

type CompleteDeliveryUseCaseRepos = {
  contractRepo: ContractRepository;
  registrationRepo: SupplierRegistrationRepository;
  orderRepo: OrderRepository;
  userRepo: UserRepository;
};

type CompleteDeliveryUseCaseInput = {
  txHash: string;
  contractAddress: string;
};

export class CompleteDeliveryUseCase {
  constructor(private readonly repos: CompleteDeliveryUseCaseRepos) {}

  async execute(input: CompleteDeliveryUseCaseInput) {
    const decoder = ProcurementContractService.create(input.contractAddress);

    const data = await decoder.decodeTransaction(input.txHash);

    if (!data.status) throw new Error();

    const supplierAddress = data.input.args[0];

    const supplier =
      await this.repos.userRepo.findByWalletAddress(supplierAddress);

    if (!supplier) throw new Error();

    const contract = await this.repos.contractRepo.findByAddress(
      input.contractAddress,
    );

    if (!contract) throw new Error();

    const registration =
      await this.repos.registrationRepo.findBySupplierIdAndContractId(
        supplier.id!,
        contract.id!,
      );
    if (!registration) throw new Error();

    const order = await this.repos.orderRepo.findByRegistrationId(
      registration.id!,
    );

    if (!order) throw new Error();

    const timestamp = data.input.args[1];

    const date = new Date(Number(timestamp) * 1000);

    console.log(date);

    order.markDelivered(date);

    await this.repos.orderRepo.save(order);

    const updatedOrder = await this.repos.orderRepo.save(order);

    return OrderMapper.toDto(updatedOrder);
  }
}
