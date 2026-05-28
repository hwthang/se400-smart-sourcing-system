import { Contract } from "../../domain/entities/contract.entity";
import { ContractStatus } from "../../domain/enums/contract-status.enum";
import { AuthUser } from "../common/auth-user";

export interface ContractListQuery {
  search?: string;
  statuses: ContractStatus[];
  page: number;
  limit: number;
}

export interface ContractListResult {
  items: Contract[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ContractRepository {
  save(Contract: Contract): Promise<Contract>;

  findById(id: string): Promise<Contract | null>;
  findByIdWithDetail(id: string): Promise<any | null>;

  findByDemandId(demandId: string): Promise<Contract | null>;

  findByExternalId(externalId: string): Promise<Contract | null>;

  findByAddress(externalId: string): Promise<Contract | null>;

  findMany(params: ContractListQuery): Promise<ContractListResult>;

  findAllUnCompleted(): Promise<Contract[]>;

  getList(
    authUser: AuthUser,
    query: ContractListQuery,
  ): Promise<ContractListResult>;
}
