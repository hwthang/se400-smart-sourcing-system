import mongoose from "mongoose";
import { ContractDto } from "../../../application/dtos/contract/contract.dto";
import { Contract } from "../../../domain/entities/contract.entity";
import { EvaluationWeights } from "../../../domain/value-objects/evaluation-weights.vo";
import { PenaltyRates } from "../../../domain/value-objects/penalty-rates.vo";
import { ContractDocument } from "../schemas/contract.schema";

export class ContractMapper {
  static toPersistence(contract: Contract): Partial<ContractDocument> {
    return {
      demandId: new mongoose.Types.ObjectId(contract.demandId),
      externalId: contract.externalId,
      address: contract.address,
      evaluationWeights: {
        price: contract.evaluationWeights?.price,
        leadTime: contract.evaluationWeights?.leadTime,
        defect: contract.evaluationWeights?.defect,
      },
      penaltyRates: {
        delay: contract.penaltyRates.delay,
        defect: contract.penaltyRates.defect,
      },
      requiredDepositedAmount: contract.requiredDepositedAmount,
      status: contract.status,
    };
  }

  static toDomain(document: ContractDocument): Contract {
    const evaluationWeights = new EvaluationWeights(
      document.evaluationWeights.price,
      document.evaluationWeights.leadTime,
      document.evaluationWeights.defect,
    );

    const penaltyRates = new PenaltyRates(
      document.penaltyRates.delay,
      document.penaltyRates.defect,
    );

    const contract = new Contract({
      id: document._id.toString(),
      demandId: document.demandId.toString(),
      externalId: document.externalId,
      address: document.address,
      evaluationWeights: evaluationWeights,
      penaltyRates: penaltyRates,
      requiredDepositedAmount: document.requiredDepositedAmount,
      status: document.status,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    });

    return contract;
  }

  static toDto(contract: Contract): ContractDto {
    return {
      id: contract.id ?? "",
      demandId: contract.demandId,
      externalId: contract.externalId,
      address: contract.address,
      evaluationWeights: {
        price: contract.evaluationWeights.price,
        leadTime: contract.evaluationWeights.leadTime,
        defect: contract.evaluationWeights.defect,
      },
      penaltyRates: {
        delay: contract.penaltyRates?.delay,
        defect: contract.penaltyRates?.defect,
      },
      requiredDepositedAmount: contract.requiredDepositedAmount,
      status: contract.status,
      createdAt: contract.createdAt ?? new Date(),
      updatedAt: contract.updatedAt ?? new Date(),
    };
  }
}
