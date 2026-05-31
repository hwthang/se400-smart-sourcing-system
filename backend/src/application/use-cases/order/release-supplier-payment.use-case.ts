import { ethers } from "ethers";
import { ProcurementContractService } from "../../../infrastructure/blockchain/services/procurement-contract.service";
import { OrderMapper } from "../../../infrastructure/persistence/mappers/order.mapper";
import { ContractRepository } from "../../repositories/contract.repo";
import { OrderRepository } from "../../repositories/order.repo";
import { SupplierRegistrationRepository } from "../../repositories/supplier-registration.repo";
import { UserRepository } from "../../repositories/user.repo";
import { BlockchainTransactionRepository } from "../../repositories/blockchain-transaction.repo";
import { BlockchainTransaction } from "../../../domain/entities/blockchain-transaction.entity";

type ReleaseSupplierPaymentUseCaseRepos = {
  contractRepo: ContractRepository;
  orderRepo: OrderRepository;
  userRepo: UserRepository;
  registrationRepo: SupplierRegistrationRepository;
  transactionRepo: BlockchainTransactionRepository;
};

type ReleaseSupplierPaymentUseCaseInput = {
  txHash: string;
  contractAddress: string;
};

export class ReleaseSupplierPaymentUseCase {
  constructor(private readonly repos: ReleaseSupplierPaymentUseCaseRepos) {}

  async execute(input: ReleaseSupplierPaymentUseCaseInput) {
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

    const amount = data.logs[0].args[1];

    const amountEth = Number(ethers.formatEther(amount));

    order.complete(amountEth);

    await this.repos.orderRepo.save(order);

    const updatedOrder = await this.repos.orderRepo.save(order);

    const transaction = BlockchainTransaction.create({
      txHash: input.txHash,
      contractAddress: input.contractAddress,
      method: "RELEASE_PAYMENT",
      status: data?.status == 1 ? "CONFIRMED" : "FAILED",
    });
    await this.repos.transactionRepo.create(transaction);

    return OrderMapper.toDto(updatedOrder);
  }
}
