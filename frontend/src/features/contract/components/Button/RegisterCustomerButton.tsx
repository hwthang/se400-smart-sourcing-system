import { useState } from "react";
import { User, Loader2, AlertCircle, Wallet } from "lucide-react";
import { useRegisterCustomer } from "../../hooks/use-contract";
import Modal from "../../../../shared/ui/modal/Modal";
import toast from "react-hot-toast";
import { useProcurement } from "../../../../core/blockchain/hooks/useProcurement";

const shortenAddress = (address: string) => {
  if (!address) return "N/A";
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

export const RegisterCustomerButton = ({ contract, customer }: any) => {
  const syncRegisterCustomer = useRegisterCustomer();
  const { registerCustomer: registerCustomerTx } = useProcurement(
    contract?.address,
  );
  console.log(contract);
  const [open, setOpen] = useState(false);
  const customerAddress = customer?.walletAddress;

  const handleConfirm = async () => {
    try {
      // =====================================================
      // 1. BLOCKCHAIN TRANSACTION
      // =====================================================
      const txHash = await registerCustomerTx.mutateAsync(customerAddress);

      // =====================================================
      // 2. BACKEND SYNC
      // =====================================================
      await syncRegisterCustomer.mutateAsync({
        id: contract.id,
        data: {
          txHash,
          contractAddress: contract.address,
        },
      });
      setOpen(false);
    } catch (err: any) {
      toast.error(err?.message || "Register customer failed");
    }
  };

  // Cập nhật disabled trạng thái khi blockchain tx hoặc backend sync đang pending
  const isPending = syncRegisterCustomer.isPending;
  const isButtonDisabled = isPending;

  return (
    <>
      {contract.status === "DEPLOYED" && (
        <button
          type="button"
          disabled={isButtonDisabled}
          onClick={() => setOpen(true)}
          className="
            w-full md:w-auto flex-grow
            bg-white hover:bg-blue-50/80
            text-blue-800 border border-blue-200
            rounded-md px-4 py-2 text-xs font-bold
            shadow-sm transition-all duration-200
            flex items-center justify-center gap-1.5
            disabled:opacity-40 disabled:cursor-not-allowed
            active:scale-[0.99]
          "
        >
          {isPending ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <User className="w-3.5 h-3.5" />
          )}
          Register Customer
        </button>
      )}

      {/* CONFIRMATION PORTAL MODAL */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Register Client Node Identity"
      >
        <div className="flex flex-col space-y-4 text-left">
          {/* Business Info Banner */}
          <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-md flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-blue-800 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wide">
                Identity Mapping Verification
              </h4>
              <p className="text-[11px] text-blue-800/90 leading-normal">
                You are anchoring your current session account as the primary
                purchasing authority (Customer) for this supply chain contract
                ledger.
              </p>
            </div>
          </div>

          {/* Target Metadata Display */}
          <div className="space-y-3 px-1 py-1">
            {/* Trường hiển thị địa chỉ ví khách hàng */}
            <div className="space-y-1">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <Wallet className="w-3 h-3" /> Customer Wallet Address
              </div>
              <div
                title={customerAddress}
                className="text-xs font-mono font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded px-3 py-2 flex justify-between items-center"
              >
                <span>
                  {customerAddress
                    ? shortenAddress(customerAddress)
                    : "No address connected"}
                </span>
                <span className="text-[10px] bg-slate-200/60 text-slate-600 px-1.5 py-0.5 rounded font-sans uppercase tracking-tight">
                  Detected
                </span>
              </div>
            </div>

            {/* Thông tin hợp đồng */}
            <div className="space-y-1">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Target Procurement Pipeline
              </div>
              <div className="text-sm font-bold text-blue-900 bg-blue-50/30 border border-blue-100 rounded px-3 py-2">
                {contract?.name || "Unnamed Procurement Instance"}
              </div>
            </div>

            <p className="text-[11px] text-gray-500 leading-relaxed pt-0.5">
              Confirming this binding allows you to handle subsequent escrow
              funding operations, order distributions, and milestone clearances.
            </p>
          </div>

          {/* Action Control Gateway Footers */}
          <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-4 mt-2">
            <button
              type="button"
              disabled={isPending}
              onClick={() => setOpen(false)}
              className="
                px-4 py-2 border border-gray-200 hover:border-gray-300 
                text-gray-600 hover:text-gray-800 text-xs font-bold 
                rounded shadow-sm transition-all bg-white disabled:opacity-40
              "
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={isPending || !customerAddress}
              onClick={handleConfirm}
              className="
                px-4 py-2 text-xs font-bold rounded shadow-sm transition-all
                bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 
                hover:from-blue-950 hover:to-indigo-950 text-white 
                flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed
              "
            >
              {isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Broadcasting...
                </>
              ) : (
                "Confirm Registration"
              )}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
