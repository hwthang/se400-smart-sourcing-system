import { Demand } from "../../domain/entities/demand.entity";
import { DemandStatus } from "../../domain/enums/demand-status.enum";
import { AuthUser } from "../common/auth-user";

export interface DemandListQuery {
  search?: string;
  statuses?: DemandStatus[];
  page: number;
  limit: number;
}

export interface DemandListResult {
  items: Demand[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface DemandRepository {
  save(demand: Demand): Promise<Demand>;

  findById(id: string): Promise<Demand | null>;

  findMany(params: DemandListQuery): Promise<DemandListResult>;

  getList(
    authUser: AuthUser,
    query: DemandListQuery,
  ): Promise<DemandListResult>;
}
