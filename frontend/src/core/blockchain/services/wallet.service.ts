import { BrowserProvider, JsonRpcSigner } from "ethers";

export class WalletService {
  private provider?: BrowserProvider;

  async connect(): Promise<{
    provider: BrowserProvider;
    signer: JsonRpcSigner;
    account: string;
  }> {
    if (!window.ethereum) {
      throw new Error("MetaMask is not installed");
    }

    this.provider = new BrowserProvider(window.ethereum);

    await this.provider.send("eth_requestAccounts", []);

    const signer = await this.provider.getSigner();

    return {
      provider: this.provider,
      signer,
      account: await signer.getAddress(),
    };
  }

  async getSigner() {
    if (!this.provider) {
      throw new Error("Wallet not connected");
    }

    return await this.provider.getSigner();
  }

  async getNetwork() {
    if (!this.provider) {
      throw new Error("Wallet not connected");
    }

    return await this.provider.getNetwork();
  }
}