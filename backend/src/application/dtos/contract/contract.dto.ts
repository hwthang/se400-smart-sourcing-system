import { ContractStatus } from "../../../domain/enums/contract-status.enum";

export interface ContractDto {
  id: string;
  demandId: string;
  externalId: string;
  address: string;
  evaluationWeights: { price: number; leadTime: number; defect: number };
  penaltyRates: {
    delay: number;
    defect: number;
  };
  requiredDepositedAmount: number;
  status: ContractStatus;
  createdAt: Date;
  updatedAt: Date;
}
