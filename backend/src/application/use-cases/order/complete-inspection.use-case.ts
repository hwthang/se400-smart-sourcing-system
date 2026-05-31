import { BlockchainTransaction } from "../../../domain/entities/blockchain-transaction.entity";
import { ProcurementContractService } from "../../../infrastructure/blockchain/services/procurement-contract.service";
import { OrderMapper } from "../../../infrastructure/persistence/mappers/order.mapper";
import { BlockchainTransactionRepository } from "../../repositories/blockchain-transaction.repo";
import { ContractRepository } from "../../repositories/contract.repo";
import { OrderRepository } from "../../repositories/order.repo";
import { SupplierRegistrationRepository } from "../../repositories/supplier-registration.repo";
import { UserRepository } from "../../repositories/user.repo";

type CompleteInspectionUseCaseRepos = {
  contractRepo: ContractRepository;
  registrationRepo: SupplierRegistrationRepository;
  orderRepo: OrderRepository;
  transactionRepo: BlockchainTransactionRepository;
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
    const defectRate = Number((Number(rate) / 100).toFixed(2));

    order.markInspected(defectRate);

    await this.repos.orderRepo.save(order);

    const updatedOrder = await this.repos.orderRepo.save(order);

    const transaction = BlockchainTransaction.create({
      txHash: input.txHash,
      contractAddress: input.contractAddress,
      method: "COMPLETE_INSPECTION",
      status: data?.status == 1 ? "CONFIRMED" : "FAILED",
    });
    await this.repos.transactionRepo.create(transaction);

    return OrderMapper.toDto(updatedOrder);
  }
}
