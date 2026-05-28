export interface UpdateDemandDto {
  product?: {
   sku: string;
    name: string;
    description: string;
    specifications: Record<string, string>;
  
  };
  requestedQuantity?: number;
  requestedDeliveryDate?: Date;
}
