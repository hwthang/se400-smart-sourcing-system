import { Order } from "../../domain/entities/order.entity";

export type SupplierData = {
  registrationId: string;
  P: number;
  reversedP: number;
  L: number;
  reversedL: number;
  R: number;
  reversedR: number;
  S: number;
  minQS: number;
  maxQS: number;
  minQB: number;
  c: number;
  minQ: number;
  Q: number;
  estimatedAmount: number;
};

export type ContractData = {
  Q: number;
  priceW: number;
  leadTimeW: number;
  defectW: number;
};

export class AllocationService {
  calculateMinQuantity = (data: {
    Q: number; // The total customer demand or the buyer's overall order quantity to be allocated
    minQB: number; // The minimum order size the buyer desires to assign to supplier i to safeguard long-run cooperation
    c: number; // The coefficient of the whole order used as a safety threshold to calculate the agreed minimum supply
    minQS: number; // The minimum supply capacity declared by supplier i during the term announcement phase
    maxQS: number;
  }) => {
    let minQ = 0;
    minQ = Math.max(data.minQB, data.minQS);
    minQ = minQ <= data.c * data.Q ? minQ : data.c * data.Q;
    minQ = minQ < data.maxQS ? minQ : data.maxQS;
    return Math.floor(minQ);
  };

  calculateReversedValue = (value: number): number => {
    return Number(Number((1 / value).toFixed(18)));
  };

  calculateScore = (data: {
    reversedP: number; // The inverse value of supplier i's unit price (1/Pi), used to transform the negative price criterion into a positive score component.
    totalReversedP: number; // The summation of inverse prices from all registered suppliers (Σ 1/Pi), serving as the denominator for price score normalization.
    reversedL: number; // The inverse value of supplier i's maximum delivery delay (1/Li), where a higher inverse value indicates a better delivery performance.
    totalReversedL: number; // The summation of inverse delivery delays for all suppliers (Σ 1/Li), used for lead time score normalization [2].
    reversedR: number; // The inverse value of supplier i's maximum defect rate (1/Ri), reflecting the quality capability in a positive numeric format.
    totalReversedR: number; // The summation of inverse defect rates for all suppliers (Σ 1/Ri), used for quality score normalization [2].
    priceWeight: number; // The strategic weight (w1) assigned by the buyer to the cost criterion, indicating its relative importance in the total score .
    leadTimeWeight: number; // The strategic weight (w2) assigned by the buyer to the delivery time delay criterion [2, 4, 5].
    defectWeight: number; // The strategic weight (w3) assigned by the buyer to the product quality/defect rate criterion [2, 4, 5].
  }) => {
    const {
      reversedP,
      reversedL,
      reversedR,
      totalReversedP,
      totalReversedL,
      totalReversedR,
      priceWeight,
      leadTimeWeight,
      defectWeight,
    } = data;
    const score =
      priceWeight * (reversedP / totalReversedP) +
      leadTimeWeight * (reversedL / totalReversedL) +
      defectWeight * (reversedR / totalReversedR);

    return Number(Number(score).toFixed(10));
  };

  calculateAllocatedQuantity = (data: {
    minQ: number;
    S: number;
    totalS: number;
    Q: number;
    totalMinQ: number;
  }) => {
    const { minQ, S, totalMinQ, totalS, Q } = data;
    const allocatedQ = Math.round(minQ + (S / totalS) * (Q - totalMinQ));
    return allocatedQ;
  };

  execute(suppliers: SupplierData[], contract: ContractData) {
    let totalReversedL = suppliers.reduce(
      (sum, supplier) => sum + this.calculateReversedValue(supplier.L),
      0,
    );
    let totalReversedR = suppliers.reduce(
      (sum, supplier) => sum + this.calculateReversedValue(supplier.R),
      0,
    );
    let totalReversedP = suppliers.reduce(
      (sum, supplier) => sum + this.calculateReversedValue(supplier.P),
      0,
    );

    let totalScore = 0;
    let totalMinQ = 0;
    let requiredDepositedAmount = 0;

    suppliers.forEach((supplier) => {
      supplier.minQ = this.calculateMinQuantity({
        Q: contract.Q,
        minQB: supplier.minQB,
        minQS: supplier.minQS,
        c: supplier.c,
        maxQS: supplier.maxQS,
      });
      supplier.reversedL = this.calculateReversedValue(supplier.L);
      supplier.reversedR = this.calculateReversedValue(supplier.R);
      supplier.reversedP = this.calculateReversedValue(supplier.P);

      totalMinQ += supplier.minQ;
    });

  


    suppliers.forEach((supplier) => {
      supplier.S = this.calculateScore({
        reversedR: supplier.reversedR,
        reversedL: supplier.reversedL,
        reversedP: supplier.reversedP,
        totalReversedL,
        totalReversedP,
        totalReversedR,
        priceWeight: contract.priceW,
        leadTimeWeight: contract.leadTimeW,
        defectWeight: contract.defectW,
      });
      totalScore += supplier.S;
    });

    suppliers.forEach((supplier) => {
      supplier.Q = this.calculateAllocatedQuantity({
        minQ: supplier.minQ,
        S: supplier.S,
        totalS: totalScore,
        Q: contract.Q,
        totalMinQ,
      });

      supplier.estimatedAmount = supplier.Q * supplier.P;
      requiredDepositedAmount += supplier.estimatedAmount;
    });

    const orders = suppliers.map((supplier) => {
      return Order.create({
        registrationId: supplier.registrationId,
        allocationScore: supplier.S,
        assignedQuantity: supplier.Q,
        estimatedAmount: supplier.estimatedAmount,
      });
    });

     console.log(suppliers)

    return {
      orders,
      requiredDepositedAmount,
    };
  }
}
