import { ethers } from "ethers";
import { EthersService } from "./ethers.service";
import SourcingSystemAbi from "../contracts/sourcing-system/SourcingSystem.json";
import { PrecisionHelper } from "../../../utils/precision-helper";

type CreateProcurementParams = {
  externalId: string;
  buyer: string;
  priceWeight: number;
  defectWeight: number;
  leadTimeWeight: number;
  delayPenaltyRate: number;
  defectPenaltyRate: number;
};

export class SourcingSystemService {
  private readonly contract: ethers.Contract;
  private readonly provider: ethers.Provider;

  constructor() {
    const ethersService = EthersService.getInstance();

    this.provider = ethersService.getRpcProvider();

    this.contract = new ethers.Contract(
      process.env.SOURCING_SYSTEM_ADDRESS!,
      SourcingSystemAbi.abi,
      ethersService.getSigner(),
    );
  }

  // =========================================================
  // CREATE PROCUREMENT CONTRACT
  // =========================================================
  async createProcurementContract(params: CreateProcurementParams) {
    const tx = await this.contract.createProcurementContract(
      params.externalId,
      ethers.getAddress(params.buyer),
      PrecisionHelper.toBasicPointFromPercentage(params.priceWeight),
      PrecisionHelper.toBasicPointFromPercentage(params.defectWeight),
      PrecisionHelper.toBasicPointFromPercentage(params.leadTimeWeight),
      ethers.parseEther(params.delayPenaltyRate.toFixed(4)),
      PrecisionHelper.toBasicPointFromPercentage(params.defectPenaltyRate),
    );

    const receipt = await tx.wait();

    const event = this.findEvent(receipt, "ProcurementContractCreated");

    const contractAddress =
      event?.args?.contractAddress ?? event?.args?.[0] ?? null;

    if (contractAddress && !ethers.isAddress(contractAddress)) {
      throw new Error("Invalid contract address from event");
    }

    return {
      txHash: tx.hash,

      contractAddress,

      status: receipt?.status,
    };
  }

  // =========================================================
  // GET CONTRACT BY EXTERNAL ID
  // =========================================================
  async getContractAddress(externalId: string) {
    return this.contract.getProcurementContractByExternalId(
      ethers.id(externalId),
    );
  }

  // =========================================================
  // DECODE TRANSACTION (DEBUG TOOL)
  // =========================================================
  async decodeTransaction(txHash: string) {
    const tx = await this.provider.getTransaction(txHash);

    if (!tx) {
      throw new Error("Transaction not found");
    }

    const receipt = await this.provider.getTransactionReceipt(txHash);

    // ================================
    // INPUT DECODE
    // ================================
    let input: any = null;

    try {
      const parsed = this.contract.interface.parseTransaction({
        data: tx.data,
        value: tx.value,
      });

      input = {
        functionName: parsed?.name,
        args: parsed?.args,
      };
    } catch {}

    // ================================
    // EVENT LOGS DECODE
    // ================================
    const logs: any[] = [];

    if (receipt) {
      for (const log of receipt.logs) {
        try {
          const parsed = this.contract.interface.parseLog(log);

          logs.push({
            eventName: parsed!.name,
            args: parsed!.args,
          });
        } catch {}
      }
    }

    return {
      hash: tx.hash,
      status: receipt?.status,
      input,
      logs,
    };
  }

  // =========================================================
  // SAFE EVENT FINDER
  // =========================================================
  private findEvent(receipt: any, eventName: string) {
    for (const log of receipt.logs) {
      try {
        const parsed = this.contract.interface.parseLog(log);
        if (parsed?.name === eventName) {
          return parsed;
        }
      } catch {}
    }
    return null;
  }
}
