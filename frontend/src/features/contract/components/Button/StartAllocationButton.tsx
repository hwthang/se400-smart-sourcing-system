import { useState } from "react";
import { Gavel, Loader2, AlertCircle } from "lucide-react";
import { useStartAllocationPhase } from "../../hooks/use-contract";
import Modal from "../../../../shared/ui/modal/Modal";
import { useProcurement } from "../../../../core/blockchain/hooks/useProcurement";

export const StartAllocationButton = ({ contract }: any) => {
  const mutation = useStartAllocationPhase();

  const { startAllocationPhase } = useProcurement(contract?.address);

  const [open, setOpen] = useState(false);

  const handleConfirm = async () => {
    try {
      // =====================================
      // 1. BLOCKCHAIN
      // =====================================
      const txHash = await startAllocationPhase.mutateAsync();

      // =====================================
      // 2. BACKEND
      // =====================================
      await mutation.mutateAsync({
        id: contract.id,

        data: {
          txHash,

          contractAddress: contract?.address,
        },
      });

      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const isButtonDiabled = mutation.isPending;

  return (
    <>
      {/* TRIGGER BUTTON */}
      {contract?.status == "QUOTATIONS_CONFIRMED" && (
        <button
          type="button"
          disabled={isButtonDiabled}
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
          {mutation.isPending ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Gavel className="w-3.5 h-3.5" />
          )}
          Start Allocation Phase
        </button>
      )}

      {/* CONFIRMATION PORTAL MODAL */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Initialize Supplier Allocation Engine"
      >
        <div className="flex flex-col space-y-4 text-left">
          {/* Business Warning Banner */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-md flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                Demand Lock & Optimization Trigger
              </h4>
              <p className="text-[11px] text-amber-800 leading-normal">
                You are initiating the sourcing optimization matrix. This
                operation strictly freezes current demand orders and opens the
                cryptographic data mapping for supplier capacity calculations.
              </p>
            </div>
          </div>

          {/* Target Metadata Display */}
          <div className="space-y-1.5 px-1 py-1">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Target Procurement Pipeline
            </div>
            <div className="text-sm font-bold text-blue-900 bg-blue-50/50 border border-blue-100 rounded px-3 py-2">
              {contract?.name || "Unnamed Procurement Instance"}
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed pt-0.5">
              Once confirmed, the system will execute algorithms to distribute
              line-item quantities across validated vendors under given supply
              constraints.
            </p>
          </div>

          {/* Action Control Gateway Footers */}
          <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-4 mt-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="
                px-4 py-2 border border-gray-200 hover:border-gray-300 
                text-gray-600 hover:text-gray-800 text-xs font-bold 
                rounded shadow-sm transition-all bg-white
              "
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              className="
                px-4 py-2 text-xs font-bold rounded shadow-sm transition-all
                bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 
                hover:from-blue-950 hover:to-indigo-950 text-white 
                flex items-center gap-1.5
              "
            >
              Confirm & Lock Stage
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
