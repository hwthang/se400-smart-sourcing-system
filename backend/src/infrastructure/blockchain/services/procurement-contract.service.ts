import { ethers } from "ethers";
import ProcurementContractAbi from "../contracts/procurement-contract/ProcurementContract.json";
import { EthersService } from "./ethers.service";

type CreateOrderInput = {
  supplier: string;
  allocationScore: bigint | number;
  allocatedQuantity: string | number;
  estimatedAmount: string | number;
};

export class ProcurementContractService {
  private readonly provider: ethers.JsonRpcProvider;
  private readonly signer: ethers.Signer;
  private readonly contractAddress: string;

  // serialize tx to prevent race condition
  private queue: Promise<any> = Promise.resolve();

  constructor(contractAddress: string) {
    const ethersService = EthersService.getInstance();

    this.provider = ethersService.getRpcProvider();

    // IMPORTANT: signer only, no manual nonce management
    this.signer = ethersService.getSigner().connect(this.provider);

    this.contractAddress = contractAddress;
  }

  static create(contractAddress: string) {
    return new ProcurementContractService(contractAddress);
  }

  // ================================
  // CONTRACT FACTORY (fresh instance per tx)
  // ================================
  private getContract() {
    return new ethers.Contract(
      this.contractAddress,
      ProcurementContractAbi.abi,
      this.signer,
    );
  }

  // ================================
  // SAFE CONVERTERS
  // ================================
  private toBigInt(value: any): bigint {
    if (typeof value === "bigint") return value;
    if (typeof value === "number") return BigInt(Math.floor(value));
    if (typeof value === "string") return BigInt(value);

    throw new Error(`Invalid BigInt value: ${value}`);
  }

  // uint16 safe (0 - 65535)
  private toUint16(value: any): bigint {
    const n = Number(value);

    if (!Number.isFinite(n)) {
      throw new Error("allocationScore is NaN/invalid");
    }

    const safe = Math.max(0, Math.min(65535, Math.round(n)));

    return BigInt(safe);
  }

  // ================================
  // TX: CREATE ORDER (QUEUE SAFE)
  // ================================
  async createOrder(input: CreateOrderInput) {
    this.queue = this.queue.then(async () => {
      const contract = this.getContract();

      // ❌ NO MANUAL NONCE (IMPORTANT FIX)
      const tx = await contract.createOrder(
        input.supplier,
        this.toUint16(input.allocationScore),
        this.toBigInt(input.allocatedQuantity),
        this.toBigInt(input.estimatedAmount),
      );

      const receipt = await tx.wait();

      return {
        txHash: tx.hash,
        status: receipt.status,
        blockNumber: receipt.blockNumber,
      };
    });

    return this.queue;
  }

  // ================================
  // TX DECODER
  // ================================
  async decodeTransaction(txHash: string) {
    const tx = await this.provider.getTransaction(txHash);

    if (!tx) {
      throw new Error("Transaction not found");
    }

    const receipt = await this.provider.getTransactionReceipt(txHash);

    let input: any = null;

    try {
      const parsed = this.getContract().interface.parseTransaction({
        data: tx.data,
        value: tx.value,
      });

      input = {
        functionName: parsed?.name,
        args: parsed?.args,
      };
    } catch {
      input = null;
    }

    const logs: any[] = [];

    if (receipt) {
      for (const log of receipt.logs) {
        try {
          const parsed = this.getContract().interface.parseLog({
            topics: log.topics,
            data: log.data,
          });

          logs.push({
            eventName: parsed?.name,
            args: parsed?.args,
          });
        } catch {
          // ignore unrelated logs
        }
      }
    }

    return {
      hash: tx.hash,
      status: receipt?.status,
      input,
      logs,
    };
  }
}