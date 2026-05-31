import { UserRole } from "../../../domain/enums/user-role.enum";
import { ContractStatus } from "../../../domain/enums/contract-status.enum";
import { ContractMapper } from "../../../infrastructure/persistence/mappers/contract.mapper";
import { AppError } from "../../../presentation/errors/app.error";
import { AuthUser } from "../../common/auth-user";
import { UpdateContractDto } from "../../dtos/contract/update-contract.dto";
import { ContractRepository } from "../../repositories/contract.repo";
import { DemandRepository } from "../../repositories/demand.repo";
import { EvaluationWeights } from "../../../domain/value-objects/evaluation-weights.vo";
import { PenaltyRates } from "../../../domain/value-objects/penalty-rates.vo";
import { PrecisionHelper } from "../../../utils/precision-helper";

type UpdateContractUseCaseRepos = {
  contractRepo: ContractRepository;
  demandRepo: DemandRepository;
};

type UpdateContractUseCaseInput = {
  authUser: AuthUser;
  contractId: string;
  dto: UpdateContractDto;
};

export class UpdateContractUseCase {
  constructor(private readonly repos: UpdateContractUseCaseRepos) {}

  async execute(input: UpdateContractUseCaseInput) {
    try {
      if (input.authUser.role !== UserRole.EMPLOYEE) {
        throw new AppError(
          "You don't have permission to update contracts",
          403,
        );
      }

      const contract = await this.repos.contractRepo.findById(input.contractId);
      if (!contract) throw new AppError("Contract not found", 404);

      if (contract.status !== ContractStatus.CREATED) {
        throw new AppError(
          `Cannot update contract in ${contract.status} status`,
          400,
        );
      }

      const demand = await this.repos.demandRepo.findById(contract.demandId);
      if (!demand) throw new AppError("Demand not found", 404);

      if (demand.assignedEmployeeId !== input.authUser.id) {
        throw new AppError(
          "Only the assigned employee can update this contract",
          403,
        );
      }
      const evaluationWeights = new EvaluationWeights(
        input.dto.evaluationWeights?.price!,
        input.dto.evaluationWeights?.leadTime!,
        input.dto.evaluationWeights?.defect!,
      );

      const penaltyRates = new PenaltyRates(
        input.dto.penaltyRates?.delay!,
        input.dto.penaltyRates?.defect!,
      );
      contract.update({ evaluationWeights, penaltyRates });
      const updatedContract = await this.repos.contractRepo.save(contract);

      return ContractMapper.toDto(updatedContract);
    } catch (error) {
      console.error("UpdateContractUseCase error:", error);
      if (error instanceof AppError) throw error;
      throw new AppError("Failed to update contract", 500);
    }
  }
}
