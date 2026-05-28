import { ProcurementContractService } from "../../../infrastructure/blockchain/services/procurement-contract.service";
import { OrderMapper } from "../../../infrastructure/persistence/mappers/order.mapper";
import { ContractRepository } from "../../repositories/contract.repo";
import { OrderRepository } from "../../repositories/order.repo";
import { SupplierRegistrationRepository } from "../../repositories/supplier-registration.repo";
import { UserRepository } from "../../repositories/user.repo";

type CompleteInspectionUseCaseRepos = {
  contractRepo: ContractRepository;
  registrationRepo: SupplierRegistrationRepository;
  orderRepo: OrderRepository;
  userRepo: UserRepository;
};

type CompleteInspectionUseCaseInput = {
  txHash: string;
  contractAddress: string;
};

export class CompleteInspectionUseCase {
  constructor(private readonly repos: CompleteInspectionUseCaseRepos) {}

  async execute(input: CompleteInspectionUseCaseInput) {
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

    const rate = data.input.args[1];

    const defectRate = Number(rate)

    order.markInspected(defectRate);

    await this.repos.orderRepo.save(order);

    const updatedOrder = await this.repos.orderRepo.save(order);

    return OrderMapper.toDto(updatedOrder);
  }
}
