import { useState } from "react";
import { Zap, Loader2, AlertCircle } from "lucide-react";

import Modal from "../../../../shared/ui/modal/Modal";

import { useStartExecutingPhase as useStartExecutingPhaseBackend } from "../../hooks/use-contract";
import { useProcurement } from "../../../../core/blockchain/hooks/useProcurement";


export const StartExecutingButton = ({ contract }: any) => {
  // =========================================================
  // HOOKS
  // =========================================================
  const procurement = useProcurement(contract?.address);
  const backend = useStartExecutingPhaseBackend();

  const [open, setOpen] = useState(false);

  // =========================================================
  // HYBRID FLOW
  // =========================================================
  const handleConfirm = async () => {
    try {
      // =====================================
      // 1. BLOCKCHAIN
      // =====================================
      const txHash =
        await procurement.startExecutingPhase.mutateAsync();

      // =====================================
      // 2. BACKEND SYNC
      // =====================================
      await backend.mutateAsync({
        id: contract?.id,
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

  const isLoading =
    procurement.startExecutingPhase.isPending || backend.isPending;

  return (
    <>
      {/* TRIGGER BUTTON */}
      {contract.status === "FUNDED" && (
        <button
          type="button"
          disabled={isLoading}
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
          {isLoading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Zap className="w-3.5 h-3.5" />
          )}
          Start Executing Phase
        </button>
      )}

      {/* MODAL */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Authorize Execution Phase Transition"
      >
        <div className="flex flex-col space-y-4 text-left">
          {/* WARNING */}
          <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-md flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-blue-800 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wide">
                Operational Pipeline Activation
              </h4>
              <p className="text-[11px] text-blue-800/90 leading-normal">
                This will move the system into execution phase and lock state
                transitions on-chain.
              </p>
            </div>
          </div>

          {/* TARGET */}
          <div className="text-sm font-bold text-blue-900 bg-blue-50/30 border border-blue-100 rounded px-3 py-2">
            {contract?.name || "Unnamed Procurement Instance"}
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-2 border-t pt-4">
            <button
              onClick={() => setOpen(false)}
              className="px-4 py-2 text-xs font-bold text-gray-600"
            >
              Cancel
            </button>

            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className="
                px-4 py-2 text-xs font-bold text-white
                bg-blue-900 hover:bg-blue-950
                rounded shadow-sm
                disabled:opacity-40
              "
            >
              {isLoading ? "Processing..." : "Confirm & Launch Execution"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};