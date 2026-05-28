export interface CreateDemandDto {
  customerId: string;
  product: {
    sku: string;
    name: string;
    description: string;
    specifications: Record<string, string>;
  };
  requestedQuantity: number;
  requestedDeliveryDate: Date;
}
