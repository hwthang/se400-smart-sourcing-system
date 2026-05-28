// application/repositories/supplier-registration.repo.ts
import { SupplierRegistration } from "../../domain/entities/supplier-registration.entity";
import { SupplierRegistrationStatus } from "../../domain/enums/supplier-registration-status.enum";

export interface SupplierRegistrationQuery {
  supplierId?: string;
  contractId?: string;
  statuses?: SupplierRegistrationStatus[];
  search?: string;
  page: number;
  limit: number;
}

export interface SupplierRegistrationSearchResult {
  items: SupplierRegistration[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SupplierRegistrationRepository {
  /**
   * Lưu supplier registration (create hoặc update)
   */
  save(registration: SupplierRegistration): Promise<SupplierRegistration>;

  /**
   * Tìm supplier registration theo ID
   */
  findById(id: string): Promise<SupplierRegistration | null>;

  /**
   * Tìm supplier registration theo supplierId và contractId
   */
  findBySupplierIdAndContractId(
    supplierId: string,
    contractId: string,
  ): Promise<SupplierRegistration | null>;

  findAllByContractId(contractId: string): Promise<SupplierRegistration[]>;

  /**
   * Tìm nhiều supplier registration với filter
   */
  findMany(
    query: SupplierRegistrationQuery,
  ): Promise<SupplierRegistrationSearchResult>;
}
