import { DemandStatus } from "../../../domain/enums/demand-status.enum";

export interface DemandDto {
  id: string;
  customerId: string;
  assignedEmployeeId: string;
  product: {
    sku: string;
    name: string;
    description: string;
    specifications: Record<string, string>;
  };
  requestedQuantity: number;
  requestedDeliveryDate: Date;
  status: DemandStatus;
  rejectReason: string;
  createdAt: Date;
  updatedAt: Date;
}
