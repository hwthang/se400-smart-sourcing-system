import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  BadgeCheck,
  Check,
  ChevronRight,
  Link2,
  Mail,
  ShieldCheck,
  User,
  Wallet,
  Zap,
} from "lucide-react";

import Modal from "../../../shared/ui/modal/Modal";

import { useAuth } from "../providers/AuthProvider";
import { useWallet } from "../../../core/blockchain/hooks/useWallet";
import { useUpdateWallet } from "../hooks/useUpdateWallet";

type ConfirmState = {
  open: boolean;
  type: "CONNECT" | "SAVE" | "SYNC" | null;
};

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function UserProfileModal({ open, onClose }: Props) {
  const { user } = useAuth();

  const { account, connectWallet, isConnected } = useWallet();

  const updateWalletMutation = useUpdateWallet();

  const [wallet, setWallet] = useState("");

  const [confirm, setConfirm] = useState<ConfirmState>({
    open: false,
    type: null,
  });

  /**
   * INIT USER WALLET
   */
  useEffect(() => {
    if (open && user?.walletAddress) {
      setWallet(user.walletAddress);
    }
  }, [open, user]);

  /**
   * SYNC CONNECTED WALLET
   */
  useEffect(() => {
    if (account) {
      setWallet(account);
    }
  }, [account]);

  /**
   * OPEN CONFIRM MODAL
   */
  const openConfirm = (type: ConfirmState["type"]) => {
    setConfirm({
      open: true,
      type,
    });
  };

  /**
   * CLOSE CONFIRM MODAL
   */
  const closeConfirm = () => {
    setConfirm({
      open: false,
      type: null,
    });
  };

  /**
   * HANDLE CONFIRMED ACTION
   */
  const handleConfirmedAction = async () => {
    try {
      const { type } = confirm;

      /**
       * CONNECT WALLET
       */
      if (type === "CONNECT") {
        await connectWallet();

        toast.success("Wallet connected successfully");

        closeConfirm();

        return;
      }

      /**
       * SAVE WALLET
       */
      if (type === "SAVE") {
        if (!wallet.trim()) {
          toast.error("Wallet address is empty");

          return;
        }

        await updateWalletMutation.mutateAsync({
          address: wallet,
        });

        toast.success("Wallet saved successfully");

        closeConfirm();

        return;
      }

      /**
       * CONNECT & SYNC
       */
      if (type === "SYNC") {
        await connectWallet();

        if (!window.ethereum) {
          toast.error("MetaMask not found");

          return;
        }

        const connectedWallet = wallet;

        if (!connectedWallet) {
          toast.error("Wallet connection failed");

          return;
        }

        setWallet(connectedWallet);

        await updateWalletMutation.mutateAsync({
          address: connectedWallet,
        });

        toast.success("Wallet synced successfully");

        closeConfirm();

        return;
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || "Action failed";

      toast.error(message);
    }
  };

  /**
   * GET CONFIRM MODAL CONTENT
   */
  const getConfirmContent = () => {
    switch (confirm.type) {
      case "CONNECT":
        return {
          title: "Connect Wallet",
          message: "Do you want to connect your crypto wallet?",
          subMessage: "This will allow blockchain interaction features.",
          variant: "info",
        };

      case "SAVE":
        return {
          title: "Save Wallet",
          message: "Save this wallet address to your profile?",
          subMessage: "This wallet will be used for procurement transactions.",
          variant: "warning",
        };

      case "SYNC":
        return {
          title: "Connect & Sync",
          message: "Connect wallet and sync with your profile?",
          subMessage: "This action will link your wallet to your account.",
          variant: "success",
        };

      default:
        return {
          title: "Confirm Action",
          message: "Do you want to proceed?",
          subMessage: "",
          variant: "info",
        };
    }
  };

  if (!user) return null;

  const confirmContent = getConfirmContent();

  return (
    <>
      {/* PROFILE MODAL */}
      <Modal open={open} onClose={onClose} title="User Profile">
        <div className="flex flex-col gap-6">
          {/* USER INFO */}
          <div className="border border-gray-200 rounded-md bg-gradient-to-br from-white to-blue-50/40 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="text-left">
                <h2 className="text-lg font-bold text-gray-900">
                  Account Information
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Personal and system details
                </p>
              </div>

              <ShieldCheck className="w-6 h-6 text-blue-800" strokeWidth={2} />
            </div>

            <div className="flex flex-col">
              {/* ID */}
              <div className="flex items-center justify-between border-b border-gray-200 py-3">
                <div className="flex items-center gap-2 text-gray-500">
                  <BadgeCheck className="w-4 h-4" strokeWidth={2} />

                  <span className="text-sm font-medium">ID</span>
                </div>

                <span className="text-sm font-mono text-gray-900 text-right">
                  {user.id}
                </span>
              </div>

              {/* USERNAME */}
              <div className="flex items-center justify-between border-b border-gray-200 py-3">
                <div className="flex items-center gap-2 text-gray-500">
                  <User className="w-4 h-4" strokeWidth={2} />

                  <span className="text-sm font-medium">Username</span>
                </div>

                <span className="text-sm text-gray-900 text-right">
                  {user.username}
                </span>
              </div>

              {/* EMAIL */}
              <div className="flex items-center justify-between border-b border-gray-200 py-3">
                <div className="flex items-center gap-2 text-gray-500">
                  <Mail className="w-4 h-4" strokeWidth={2} />

                  <span className="text-sm font-medium">Email</span>
                </div>

                <span className="text-sm text-gray-900 text-right">
                  {user.email}
                </span>
              </div>

              {/* ROLE */}
              <div className="flex items-center justify-between border-b border-gray-200 py-3">
                <div className="flex items-center gap-2 text-gray-500">
                  <ShieldCheck className="w-4 h-4" strokeWidth={2} />

                  <span className="text-sm font-medium">Role</span>
                </div>

                <span className="text-sm text-gray-900 text-right">
                  {user.role}
                </span>
              </div>

              {/* STATUS */}
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-2 text-gray-500">
                  <Check className="w-4 h-4" strokeWidth={2} />

                  <span className="text-sm font-medium">Status</span>
                </div>

                <span
                  className={`
                    rounded-md
                    border
                    px-2
                    py-1
                    text-xs
                    font-medium
                    ${
                      user.isActive
                        ? `
                          border-blue-800
                          bg-blue-50
                          text-blue-800
                        `
                        : `
                          border-gray-200
                          bg-gray-50
                          text-gray-500
                        `
                    }
                  `}
                >
                  {user.isActive ? "ACTIVE" : "INACTIVE"}
                </span>
              </div>
            </div>
          </div>

          {/* WALLET SECTION */}
          <div className="border border-gray-200 rounded-md bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="text-left">
                <h2 className="text-lg font-bold text-gray-900">
                  Wallet Management
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Connect and manage blockchain wallet
                </p>
              </div>

              <Wallet className="w-6 h-6 text-blue-800" strokeWidth={2} />
            </div>

            {/* INPUT */}
            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium text-gray-900">
                Wallet Address
              </label>

              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Wallet className="w-4 h-4 text-gray-500" strokeWidth={2} />
                </div>

                <input
                  value={wallet}
                  onChange={(e) => setWallet(e.target.value)}
                  placeholder="0x..."
                  className="
                    w-full
                    bg-white
                    border
                    border-gray-200
                    text-gray-900
                    placeholder-gray-500
                    rounded-md
                    pl-9
                    pr-3
                    py-2.5
                    shadow-sm
                    font-mono
                    text-sm
                    transition-all
                    focus:outline-none
                    focus:border-2
                    focus:border-blue-800
                    focus:ring-4
                    focus:ring-blue-800/10
                  "
                />
              </div>

              {/* CONNECTION STATUS */}
              <div
                className={`
                  rounded-md
                  border
                  px-3
                  py-2
                  text-xs
                  font-medium
                  ${
                    isConnected
                      ? `
                        border-blue-800
                        bg-blue-50
                        text-blue-800
                      `
                      : `
                        border-gray-200
                        bg-gray-50
                        text-gray-500
                      `
                  }
                `}
              >
                {isConnected ? "MetaMask Connected" : "Wallet Not Connected"}
              </div>

              {/* CURRENT WALLET */}
              {user?.walletAddress && (
                <div className="border border-gray-200 rounded-md bg-blue-50 p-3">
                  <p className="text-xs text-gray-500 mb-1">Current Wallet</p>

                  <p className="font-mono text-sm text-blue-800 break-all">
                    {user.walletAddress}
                  </p>
                </div>
              )}

              {/* ACTIONS */}
              <div className="flex flex-col gap-2 pt-2">
                {/* CONNECT */}
                <button
                  onClick={() => openConfirm("CONNECT")}
                  className="
                    flex
                    items-center
                    justify-between
                    gap-2
                    bg-white
                    text-blue-800
                    border
                    border-blue-800
                    font-medium
                    px-5
                    py-2.5
                    rounded-md
                    transition-all
                    duration-200
                    hover:bg-blue-50
                    hover:shadow-md
                    active:scale-[0.98]
                  "
                >
                  <div className="flex items-center gap-2">
                    <Link2 className="w-5 h-5" strokeWidth={2} />

                    <span>Connect Wallet</span>
                  </div>

                  <ChevronRight className="w-4 h-4" strokeWidth={2} />
                </button>

                {/* SAVE */}
                <button
                  onClick={() => openConfirm("SAVE")}
                  disabled={!wallet.trim()}
                  className="
                    flex
                    items-center
                    justify-between
                    gap-2
                    bg-gradient-to-br
                    from-blue-900
                    via-blue-800
                    to-indigo-900
                    text-white
                    font-medium
                    px-5
                    py-2.5
                    rounded-md
                    shadow-sm
                    border
                    border-blue-900/50
                    transition-all
                    duration-200
                    hover:shadow-md
                    hover:brightness-110
                    active:scale-[0.98]
                    disabled:opacity-40
                    disabled:pointer-events-none
                  "
                >
                  <div className="flex items-center gap-2">
                    <Wallet className="w-5 h-5" strokeWidth={2} />

                    <span>Save Wallet</span>
                  </div>

                  <ChevronRight className="w-4 h-4" strokeWidth={2} />
                </button>

                {/* SYNC */}
                <button
                  onClick={() => openConfirm("SYNC")}
                  className="
                    flex
                    items-center
                    justify-between
                    gap-2
                    bg-white
                    text-blue-800
                    border
                    border-blue-800
                    font-medium
                    px-5
                    py-2.5
                    rounded-md
                    transition-all
                    duration-200
                    hover:bg-blue-50
                    hover:shadow-md
                    active:scale-[0.98]
                  "
                >
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5" strokeWidth={2} />

                    <span>Connect & Sync</span>
                  </div>

                  <ChevronRight className="w-4 h-4" strokeWidth={2} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* CONFIRM MODAL */}
      <Modal
        open={confirm.open}
        onClose={closeConfirm}
        title={confirmContent.title}
      >
        <div className="flex flex-col gap-6">
          <div
            className="
              rounded-md
              border
              border-blue-800
              bg-blue-50
              p-4
              shadow-sm
            "
          >
            <p className="text-left font-medium text-gray-900">
              {confirmContent.message}
            </p>

            {confirmContent.subMessage && (
              <p className="mt-2 text-sm text-gray-500">
                {confirmContent.subMessage}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3">
            {/* CANCEL */}
            <button
              type="button"
              onClick={closeConfirm}
              disabled={updateWalletMutation.isPending}
              className="
                flex
                items-center
                gap-2
                bg-white
                text-blue-800
                border
                border-blue-800
                font-medium
                px-5
                py-2.5
                rounded-md
                transition-all
                duration-200
                hover:bg-blue-50
                active:scale-[0.98]
                disabled:opacity-40
                disabled:pointer-events-none
              "
            >
              Cancel
            </button>

            {/* CONFIRM */}
            <button
              type="button"
              onClick={handleConfirmedAction}
              disabled={updateWalletMutation.isPending}
              className="
                flex
                items-center
                gap-2
                bg-gradient-to-br
                from-blue-900
                via-blue-800
                to-indigo-900
                text-white
                font-medium
                px-5
                py-2.5
                rounded-md
                shadow-sm
                border
                border-blue-900/50
                transition-all
                duration-200
                hover:shadow-md
                hover:brightness-110
                active:scale-[0.98]
                disabled:opacity-40
                disabled:pointer-events-none
              "
            >
              {updateWalletMutation.isPending ? "Processing..." : "Confirm"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
