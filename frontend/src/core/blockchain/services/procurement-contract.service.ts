import { ethers, type Signer } from "ethers";
import { ContractFactoryService } from "./contract-factory.service";
import { PrecisionHelper } from "../../../shared/utils/precision-helper";

export class ProcurementContractService {
  private readonly contract: ethers.Contract;
  private readonly provider: ethers.Provider;

  constructor(
    private readonly contractAddress: string,
    signer: Signer,
  ) {
    this.contract = ContractFactoryService.createProcurementContract(
      this.contractAddress,
      signer,
    );

    this.provider = signer.provider!;
  }

  // =========================================================
  // WRITE METHODS
  // =========================================================

  async registerCustomer(customer: string): Promise<string> {
    const tx = await this.contract.registerCustomer(customer);

    await tx.wait();
    return tx.hash;
  }

  async registerSupplier(supplier: string): Promise<string> {
    const tx = await this.contract.registerSupplier(supplier);

    await tx.wait();
    return tx.hash;
  }

  async startOrderingPhase(): Promise<string> {
    const tx = await this.contract.startOrderingPhase();

    await tx.wait();
    return tx.hash;
  }

  // renamed: createDemand → confirmDemand
  async confirmDemand(
    requestedQuantity: bigint,
    requestedDeliveryTimestamp: bigint,
  ): Promise<string> {
    const tx = await this.contract.confirmDemand(
      requestedQuantity,
      requestedDeliveryTimestamp,
    );

    await tx.wait();
    return tx.hash;
  }

  // renamed: submitSupplierQuotation → confirmSupplierQuotation
  async confirmSupplierQuotation(
    unitPrice: number,
    minSupplyQuantity: number,
    maxSupplyQuantity: number,
    maxDefectRate: number,
    maxLeadTimeDays: number,
  ): Promise<string> {
    const tx = await this.contract.confirmSupplierQuotation(
      ethers.parseEther(unitPrice.toFixed(4)),
      BigInt(minSupplyQuantity),
      BigInt(maxSupplyQuantity),
      PrecisionHelper.toBasicPointFromPercentage(maxDefectRate),
      BigInt(maxLeadTimeDays),
    );

    await tx.wait();
    return tx.hash;
  }

  async startAllocationPhase(): Promise<string> {
    const tx = await this.contract.startAllocationPhase();

    await tx.wait();
    return tx.hash;
  }

  // renamed: configureBuyerCriteria → confirmBuyerCriteria
  async confirmBuyerCriteria(
    supplier: string,
    minPurchaseQuantity: bigint,
    maxAllocationPercent: number,
  ): Promise<string> {
    const tx = await this.contract.confirmBuyerCriteria(
      supplier,
      minPurchaseQuantity,
      maxAllocationPercent,
    );

    await tx.wait();
    return tx.hash;
  }

  async createOrder(
    supplier: string,
    allocationScore: number,
    allocatedQuantity: bigint,
    estimatedAmount: bigint,
  ): Promise<string> {
    const tx = await this.contract.createOrder(
      supplier,
      allocationScore,
      allocatedQuantity,
      estimatedAmount,
    );

    await tx.wait();
    return tx.hash;
  }

  async deposit(value: bigint): Promise<string> {
    const tx = await this.contract.deposit({ value });

    await tx.wait();
    return tx.hash;
  }

  async startExecutingPhase(): Promise<string> {
    const tx = await this.contract.startExecutingPhase();

    await tx.wait();
    return tx.hash;
  }

  async completeDelivery(
    supplier: string,
    deliveryTimestamp: bigint,
  ): Promise<string> {
    const tx = await this.contract.completeDelivery(
      supplier,
      deliveryTimestamp,
    );

    await tx.wait();
    return tx.hash;
  }

  async completeInspection(
    supplier: string,
    defectRate: number,
  ): Promise<string> {
    const tx = await this.contract.completeInspection(supplier, defectRate);

    await tx.wait();
    return tx.hash;
  }

  async releaseSupplierPayment(supplier: string): Promise<string> {
    const tx = await this.contract.releaseSupplierPayment(supplier);

    await tx.wait();
    return tx.hash;
  }

  async finish(): Promise<string> {
    const tx = await this.contract.finish();

    await tx.wait();
    return tx.hash;
  }

  // =========================================================
  // READ METHODS
  // =========================================================

  async getOwner(): Promise<string> {
    return this.contract.owner();
  }

  async getBuyer(): Promise<string> {
    return this.contract.buyer();
  }

  async getCustomer(): Promise<string> {
    return this.contract.customer();
  }

  async getDemand() {
    return this.contract.demand();
  }

  async getEvaluationWeights() {
    return this.contract.evalutationWeights();
  }

  async getPenaltyRates() {
    return this.contract.penaltyRates();
  }

  async getCurrentPhase(): Promise<number> {
    return this.contract.currentPhase();
  }

  async getRegisteredSuppliers(): Promise<string[]> {
    return this.contract.registeredSuppliers();
  }

  async isAllowedSupplier(address: string): Promise<boolean> {
    return this.contract.allowedSuppliers(address);
  }

  async getQuotation(supplier: string) {
    return this.contract.quotations(supplier);
  }

  async getBuyerCriteria(supplier: string) {
    return this.contract.criteria(supplier);
  }

  async getOrder(supplier: string) {
    return this.contract.orders(supplier);
  }

  async getTransactionDetail(txHash: string) {
    const tx = await this.provider.getTransaction(txHash);

    if (!tx) {
      throw new Error("Transaction not found");
    }

    const receipt = await this.provider.getTransactionReceipt(txHash);

    
    let method: string | null = null;
    let args: any[] = [];

    try {
      const parsed = this.contract.interface.parseTransaction({
        data: tx.data,
        value: tx.value,
      });
console.log(tx)
      method = parsed?.name ?? null;
      args = parsed?.args ? [...parsed.args] : [];
    } catch {}

    const events: any[] = [];

    if (receipt) {
      for (const log of receipt.logs) {
        try {
          const parsed = this.contract.interface.parseLog(log);

          events.push({
            name: parsed?.name,
            args: parsed?.args ? [...parsed.args] : [],
          });
        } catch {}
      }
    }

    return {
      transaction: {
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: ethers.formatEther(tx.value),
        nonce: tx.nonce,
        gasLimit: tx.gasLimit.toString(),
        gasPrice: tx.gasPrice?.toString(),
      },

      receipt: receipt
        ? {
            blockNumber: receipt.blockNumber,
            status: receipt.status === 1 ? "CONFIRMED" : "FAILED",
            gasUsed: receipt.gasUsed.toString(),
            cumulativeGasUsed: receipt.cumulativeGasUsed.toString(),
            contractAddress: receipt.contractAddress,
          }
        : null,

      decodedInput: {
        method,
        args,
      },

      events,
    };
  }
}
