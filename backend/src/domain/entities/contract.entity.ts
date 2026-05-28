import { id } from "ethers";
import { ContractStatus } from "../enums/contract-status.enum";
import { DemandStatus } from "../enums/demand-status.enum";
import { EvaluationWeights } from "../value-objects/evaluation-weights.vo";
import { PenaltyRates } from "../value-objects/penalty-rates.vo";

interface ContractData {
  id?: string;
  demandId: string;
  externalId: string;
  address: string;
  evaluationWeights: EvaluationWeights;
  penaltyRates: PenaltyRates;
  requiredDepositedAmount: number;
  status: ContractStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CreateContractData {
  demandId: string;
}

interface UpdateContractData {
  evaluationWeights?: EvaluationWeights;
  penaltyRates?: PenaltyRates;
}

export class Contract {
  private _id?: string;
  private _demandId: string;
  private _externalId: string;
  private _address: string;
  private _evaluationWeights: EvaluationWeights;
  private _penaltyRates: PenaltyRates;
  private _requiredDepositedAmount: number;
  private _status: ContractStatus;
  private _createdAt?: Date;
  private _updatedAt?: Date;

  constructor(data: ContractData) {
    this._id = data.id;
    this._demandId = data.demandId;
    this._externalId = data.externalId;
    this._address = data.address;
    this._evaluationWeights = data.evaluationWeights;
    this._penaltyRates = data.penaltyRates;
    this._requiredDepositedAmount = data.requiredDepositedAmount;
    this._status = data.status;
    this._createdAt = data.createdAt;
    this._updatedAt = data.updatedAt;
  }

  set externalId(id: string) {
    this.validateStatus([ContractStatus.DEPLOYED]);
    this._externalId = id;
  }

  set address(address: string) {
    this.validateStatus([ContractStatus.DEPLOYED]);
    this._address = address;
  }

  get id(): string | undefined {
    return this._id;
  }

  get demandId(): string {
    return this._demandId;
  }

  get externalId(): string {
    return this._externalId;
  }

  get address(): string {
    return this._address;
  }

  get evaluationWeights(): EvaluationWeights {
    return this._evaluationWeights;
  }

  get penaltyRates(): PenaltyRates {
    return this._penaltyRates;
  }

  get requiredDepositedAmount(): number {
    return this._requiredDepositedAmount;
  }

  get status(): ContractStatus {
    return this._status;
  }

  get createdAt(): Date | undefined {
    return this._createdAt;
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }

  static create(data: CreateContractData): Contract {
    const contract = new Contract({
      demandId: data.demandId,
      externalId: "",
      address: "",
      evaluationWeights: {} as EvaluationWeights,
      penaltyRates: {} as PenaltyRates,
      requiredDepositedAmount: 0,
      status: ContractStatus.CREATED,
    });
    return contract;
  }

  private validateStatus(allowedStatuses: ContractStatus[]): void {
    if (!allowedStatuses.includes(this._status)) {
      throw new Error(
        `Invalid status: ${this._status}. Allowed statuses: ${allowedStatuses.join(", ")}`,
      );
    }
  }

  private transition(from: ContractStatus[], to: ContractStatus): void {
    this.validateStatus(from);

    this._status = to;
  }

  update(data: UpdateContractData): void {
    this.validateStatus([ContractStatus.CREATED]);
    if (data.evaluationWeights !== undefined) {
      this._evaluationWeights = data.evaluationWeights;
    }
    if (data.penaltyRates !== undefined) {
      this._penaltyRates = data.penaltyRates;
    }
    this._updatedAt = new Date();
  }

  openSupplierRegistration(): void {
    this.transition(
      [ContractStatus.CREATED, ContractStatus.SUPPLIER_REGISTRATION_CLOSED],
      ContractStatus.SUPPLIER_REGISTRATION_OPENED,
    );
  }

  closeSupplierRegistration(): void {
    this.transition(
      [ContractStatus.SUPPLIER_REGISTRATION_OPENED],
      ContractStatus.SUPPLIER_REGISTRATION_CLOSED,
    );
  }

  deploy(externalId: string, address: string): void {
    this.validateStatus([ContractStatus.SUPPLIER_REGISTRATION_CLOSED]);

    this._externalId = externalId;
    this._address = address;
    this._status = ContractStatus.DEPLOYED;
  }

  markCustomerRegistered(): void {
    this.transition(
      [ContractStatus.DEPLOYED],
      ContractStatus.CUSTOMER_REGISTERED,
    );
  }

  markSuppliersRegistered(): void {
    this.transition(
      [ContractStatus.CUSTOMER_REGISTERED],
      ContractStatus.SUPPLIERS_REGISTERED,
    );
  }

  requestPartyConfirmation(): void {
    this.transition(
      [ContractStatus.SUPPLIERS_REGISTERED],
      ContractStatus.PENDING_PARTY_CONFIRMATION,
    );
  }

  markDemandConfirmed(): void {
    this.transition(
      [ContractStatus.PENDING_PARTY_CONFIRMATION],
      ContractStatus.DEMAND_CONFIRMED,
    );
  }

  markQuotationsConfirmed(): void {
    this.transition(
      [ContractStatus.DEMAND_CONFIRMED],
      ContractStatus.QUOTATIONS_CONFIRMED,
    );
  }

  requestCriteriaConfiguration(): void {
    this.transition(
      [ContractStatus.QUOTATIONS_CONFIRMED],
      ContractStatus.CRITERIA_PENDING,
    );
  }

  markCriteriaSet(): void {
    this.transition(
      [ContractStatus.CRITERIA_PENDING],
      ContractStatus.CRITERIA_SET,
    );
  }

  markAllocated(amount: number): void {
    this.transition([ContractStatus.CRITERIA_SET], ContractStatus.ALLOCATED);
    this._requiredDepositedAmount = amount;
  }

  requestFunding(): void {
    this.transition([ContractStatus.ALLOCATED], ContractStatus.FUNDING);
  }

  markFunded(): void {
    this.transition([ContractStatus.FUNDING], ContractStatus.FUNDED);
  }

  execute(): void {
    this.transition([ContractStatus.FUNDED], ContractStatus.EXECUTING);
  }

  markCompleted(): void {
    this.transition([ContractStatus.EXECUTING], ContractStatus.COMPLETED);
  }
}
