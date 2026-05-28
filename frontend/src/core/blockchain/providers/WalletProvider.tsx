import {
  createContext,
  type PropsWithChildren,
  useEffect,
  useMemo,
  useState,
} from "react";

import { BrowserProvider, JsonRpcSigner } from "ethers";
import { WalletService } from "../services/wallet.service";
import Modal from "../../../shared/ui/modal/Modal";
import type { Signer } from "ethers";

type WalletContextType = {
  provider?: BrowserProvider;
  signer?: Signer;
  account?: string;

  isConnected: boolean;

  connectWallet: () => Promise<void>;
};

export const WalletContext = createContext<WalletContextType>({
  isConnected: false,
  connectWallet: async () => {},
});

const walletService = new WalletService();

export function WalletProvider({ children }: PropsWithChildren) {
  const [provider, setProvider] = useState<BrowserProvider>();
  const [signer, setSigner] = useState<Signer>();
  const [account, setAccount] = useState<string>();

  const [showConnectModal, setShowConnectModal] = useState(false);

  const setWalletState = (result: any) => {
    setProvider(result.provider);
    setSigner(result.signer);
    setAccount(result.account);
    setShowConnectModal(false);
  };

  const connectWallet = async () => {
    const result = await walletService.connect();
    setWalletState(result);
  };

  useEffect(() => {
    const init = async () => {
      if (!window.ethereum) {
        setShowConnectModal(true);
        return;
      }

      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });

        if (accounts?.length > 0) {
          const result = await walletService.connect();
          setWalletState(result);
        } else {
          setShowConnectModal(true);
        }
      } catch (err) {
        console.error(err);
        setShowConnectModal(true);
      }
    };

    init();
  }, []);

  // listen account change
  useEffect(() => {
    if (!window.ethereum) return;

    const handler = (accounts: string[]) => {
      if (accounts.length === 0) {
        setAccount(undefined);
        setShowConnectModal(true);
      } else {
        connectWallet();
      }
    };

    window.ethereum.on("accountsChanged", handler);

    return () => {
      window.ethereum.removeListener("accountsChanged", handler);
    };
  }, []);

  const value = useMemo(
    () => ({
      provider,
      signer,
      account,
      isConnected: !!account,
      connectWallet,
    }),
    [provider, signer, account],
  );

  return (
    <WalletContext.Provider value={value}>
      {children}

      {/* CONNECT MODAL */}
      {showConnectModal && (
        <ConnectWalletModal
          onConnect={connectWallet}
          onClose={() => setShowConnectModal(false)}
        />
      )}
    </WalletContext.Provider>
  );
}

type Props = {
  onConnect: () => void;
  onClose: () => void;
};

const ConnectWalletModal = ({ onConnect, onClose }: Props) => {
  return (
    <Modal open={true} onClose={onClose} title="Connect Wallet">
      <div className="flex flex-col gap-4">
        <p className="text-sm text-gray-600">
          You need to connect your MetaMask wallet to continue.
        </p>

        <button
          onClick={onConnect}
          className="
            w-full
            rounded-md
            bg-blue-800
            text-white
            py-2
            font-medium
            hover:bg-blue-700
            transition
          "
        >
          Connect MetaMask
        </button>

        <button
          onClick={onClose}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
};
