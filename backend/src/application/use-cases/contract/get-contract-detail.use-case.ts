import { BuyerCriteriaStatus } from "../../../domain/enums/buyer-criteria-status.enum";
import { ContractStatus } from "../../../domain/enums/contract-status.enum";
import { DemandStatus } from "../../../domain/enums/demand-status.enum";
import { SupplierQuotationStatus } from "../../../domain/enums/supplier-quotation-status.enum";
import { SupplierRegistrationStatus } from "../../../domain/enums/supplier-registration-status.enum";
import { UserRole } from "../../../domain/enums/user-role.enum";
import { BuyerCriteriaMapper } from "../../../infrastructure/persistence/mappers/buyer-criteria.mapper";
import { ContractMapper } from "../../../infrastructure/persistence/mappers/contract.mapper";
import { DemandMapper } from "../../../infrastructure/persistence/mappers/demand.mapper";
import { OrderMapper } from "../../../infrastructure/persistence/mappers/order.mapper";
import { SupplierQuotationMapper } from "../../../infrastructure/persistence/mappers/supplier-quotation.mapper";
import { SupplierRegistrationMapper } from "../../../infrastructure/persistence/mappers/supplier-registration.mapper";
import { UserMapper } from "../../../infrastructure/persistence/mappers/user.mapper";
import { AppError } from "../../../presentation/errors/app.error";
import { AuthUser } from "../../common/auth-user";
import { BuyerCriteriaRepository } from "../../repositories/buyer-criteria.repo";
import { ContractRepository } from "../../repositories/contract.repo";
import { DemandRepository } from "../../repositories/demand.repo";
import { OrderRepository } from "../../repositories/order.repo";
import { SupplierQuotationRepository } from "../../repositories/supplier-quotation.repo";
import { SupplierRegistrationRepository } from "../../repositories/supplier-registration.repo";
import { UserRepository } from "../../repositories/user.repo";

type GetContractDetailRepos = {
  contractRepo: ContractRepository;
  registrationRepo: SupplierRegistrationRepository;
  quotationRepo: SupplierQuotationRepository;
  criteriaRepo: BuyerCriteriaRepository;
  orderRepo: OrderRepository;
  demandRepo: DemandRepository;
  userRepo: UserRepository;
};
type GetContractDetailUseCaseInput = {
  authUser: AuthUser;
  contractId: string;
};
export class GetContractDetailUseCase {
  constructor(private readonly repos: GetContractDetailRepos) {}

  async execute(input: GetContractDetailUseCaseInput) {
    try {
      let data: any = {};
      const { contractId } = input;
      const registrations =
        await this.repos.registrationRepo.findAllByContractId(contractId);

      const contract = await this.repos.contractRepo.findById(contractId);

      if (!contract) {
        throw new AppError("Contract not found", 404);
      }

      data.contract = ContractMapper.toDto(contract);

      const demand = await this.repos.demandRepo.findById(contract.demandId);

      if (!demand) {
        throw new AppError("Demand not found", 404);
      }

      data.demand = DemandMapper.toDto(demand);

      const customer = await this.repos.userRepo.findById(demand.customerId);
      if (!customer) {
        throw new AppError("Customer not found", 404);
      }

      data.demand.customer = UserMapper.toDto(customer);

      if (input.authUser.role === UserRole.SUPPLIER) {
        const registration =
          await this.repos.registrationRepo.findBySupplierIdAndContractId(
            input.authUser.id,
            contractId,
          );

        if (registration) {
          const quotation = await this.repos.quotationRepo.findByRegistrationId(
            registration.id!,
          );

          const order = await this.repos.orderRepo.findByRegistrationId(
            registration.id!,
          );
          const supplier = await this.repos.userRepo.findById(
            registration.supplierId,
          );
          data.registration = {
            ...SupplierRegistrationMapper.toDto(registration),
            supplier: supplier ? UserMapper.toDto(supplier) : null,
            quotation: quotation
              ? SupplierQuotationMapper.toDto(quotation)
              : null,
            order: order ? OrderMapper.toDto(order) : null,
          };
        }
      }

      if (input.authUser.role === UserRole.EMPLOYEE) {
        data.registrations = await Promise.all(
          registrations.map(async (item) => {
            const quotation =
              await this.repos.quotationRepo.findByRegistrationId(item.id!);

            const criteria = await this.repos.criteriaRepo.findByRegistrationId(
              item.id!,
            );
            const order = await this.repos.orderRepo.findByRegistrationId(
              item.id!,
            );

            const supplier = await this.repos.userRepo.findById(
              item.supplierId,
            );

            return {
              ...SupplierRegistrationMapper.toDto(item),
              supplier: supplier ? UserMapper.toDto(supplier) : null,
              quotation: quotation
                ? SupplierQuotationMapper.toDto(quotation)
                : null,
              criteria: criteria ? BuyerCriteriaMapper.toDto(criteria) : null,
              order: order ? OrderMapper.toDto(order) : null,
            };
          }),
        );
      }

      data.contract = ContractMapper.toDto(contract);

      return data;
    } catch (error) {
      console.error("GetContractDetailUseCase error:", error);

      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        error instanceof Error
          ? error.message
          : "Failed to get contract detail",
        500,
      );
    }
  }
}
