import { ethers, type Signer } from "ethers";
import { ContractFactoryService } from "./contract-factory.service";

export class ProcurementContractService {
  private readonly contract: ethers.Contract;

  constructor(
    private readonly contractAddress: string,
    signer: Signer,
  ) {
    this.contract = ContractFactoryService.createProcurementContract(
      this.contractAddress,
      signer,
    );
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
    unitPrice: bigint,
    minSupplyQuantity: bigint,
    maxSupplyQuantity: bigint,
    maxDefectRate: number,
    maxLeadTimeDays: number,
  ): Promise<string> {
    const tx = await this.contract.confirmSupplierQuotation(
      unitPrice,
      minSupplyQuantity,
      maxSupplyQuantity,
      maxDefectRate,
      maxLeadTimeDays,
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
}
