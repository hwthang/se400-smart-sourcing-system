import {
  BrowserProvider,
  JsonRpcSigner,
} from "ethers";

export type WalletContextType = {
  provider?: BrowserProvider;
  signer?: JsonRpcSigner;
  account?: string;

  isConnected: boolean;

  connectWallet: () => Promise<void>;
};