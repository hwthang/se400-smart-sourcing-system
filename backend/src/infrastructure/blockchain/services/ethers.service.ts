import { ethers } from "ethers";

export class EthersService {
  private static instance: EthersService;

  private readonly rpcProvider: ethers.JsonRpcProvider;

  private readonly wsProvider: ethers.WebSocketProvider;

  private readonly signer: ethers.Wallet;

  private constructor() {
    this.rpcProvider =
      new ethers.JsonRpcProvider(
        process.env.RPC_HTTP_URL!,
      );

    this.wsProvider =
      new ethers.WebSocketProvider(
        process.env.RPC_WS_URL!,
      );

    this.signer = new ethers.Wallet(
      process.env.PRIVATE_KEY!,
      this.rpcProvider,
    );
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new EthersService();
    }

    return this.instance;
  }

  getRpcProvider() {
    return this.rpcProvider;
  }

  getWsProvider() {
    return this.wsProvider;
  }

  getSigner() {
    return this.signer;
  }
}