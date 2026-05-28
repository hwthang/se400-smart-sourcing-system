import { SupplierRegistrationStatus } from "../../../domain/enums/supplier-registration-status.enum";

export interface SupplierRegistrationDto {
  id: string;
  supplierId: string;
  contractId: string;
  status: SupplierRegistrationStatus;
  cancelReason: string;
  createdAt: Date;
  updatedAt: Date;
}
