export interface UpdateContractDto {
  evaluationWeights?: {
    price: number;
    leadTime: number;
    defect: number;
  };
  penaltyRates?: {
    delay: number;
    defect: number;
  };
}
