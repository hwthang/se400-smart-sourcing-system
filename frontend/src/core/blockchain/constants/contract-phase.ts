import { ContractPhase } from "../types/contract-phase.enum";

export const CONTRACT_PHASE_LABEL: Record<
  ContractPhase,
  string
> = {
  [ContractPhase.REGISTRATION]:
    "Registration",

  [ContractPhase.ORDERING]:
    "Ordering",

  [ContractPhase.ALLOCATION]:
    "Allocation",

  [ContractPhase.EXECUTING]:
    "Executing",

  [ContractPhase.COMPLETED]:
    "Completed",
};