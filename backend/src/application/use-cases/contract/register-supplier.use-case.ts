import { BlockchainTransaction } from "../../../domain/entities/blockchain-transaction.entity";
import { SupplierRegistration } from "../../../domain/entities/supplier-registration.entity";
import { SupplierRegistrationStatus } from "../../../domain/enums/supplier-registration-status.enum";
import { ProcurementContractService } from "../../../infrastructure/blockchain/services/procurement-contract.service";
import { ContractMapper } from "../../../infrastructure/persistence/mappers/contract.mapper";
import { AuthUser } from "../../common/auth-user";
import { BlockchainTransactionRepository } from "../../repositories/blockchain-transaction.repo";
import { ContractRepository } from "../../repositories/contract.repo";
import { SupplierRegistrationRepository } from "../../repositories/supplier-registration.repo";
import { UserRepository } from "../../repositories/user.repo";

type RegisterSupplierUseCaseRepos = {
  contractRepo: ContractRepository;
  registrationRepo: SupplierRegistrationRepository;
  userRepo: UserRepository;
  transactionRepo: BlockchainTransactionRepository;
};

type RegisterSupplierUseCaseInput = {
  authUser: AuthUser;
  txHash: string;
  contractAddress: string;
};

export class RegisterSupplierUseCase {
  constructor(private readonly repos: RegisterSupplierUseCaseRepos) {}

  async execute(input: RegisterSupplierUseCaseInput) {
    const decoder = ProcurementContractService.create(input.contractAddress);

    const data = await decoder.decodeTransaction(input.txHash);

    if (!data.status) throw new Error();

    const supplierAddress = data.input.args[0];

    console.log(supplierAddress);

    const supplier =
      await this.repos.userRepo.findByWalletAddress(supplierAddress);

    console.log(supplier);

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

    registration.confirm();

    await this.repos.registrationRepo.save(registration);

    const allRegistrations =
      await this.repos.registrationRepo.findAllByContractId(contract.id!);

    const confirmedRegistrations = allRegistrations.filter(
      (item) => item.status == SupplierRegistrationStatus.CONFIRMED,
    );

    if (confirmedRegistrations.length == allRegistrations.length) {
      contract.markSuppliersRegistered();
    }

    const updatedContract = await this.repos.contractRepo.save(contract);
    const transaction = BlockchainTransaction.create({
      txHash: input.txHash,
      contractAddress: input.contractAddress,
      method: "REGISTER_SUPPLIER",
      status: data?.status == 1 ? "CONFIRMED" : "FAILED",
    });
    await this.repos.transactionRepo.create(transaction);

    return ContractMapper.toDto(updatedContract);
  }
}
