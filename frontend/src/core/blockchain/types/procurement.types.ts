export type Demand = {
  requestedQuantity: bigint;
  requestedDeliveryTimestamp: bigint;
};

export type Order = {
  allocationScore: bigint;
  allocatedQuantity: bigint;
  estimatedAmount: bigint;
  deliveryTimestamp: bigint;
  defectRate: bigint;
  paidAmount: bigint;
};