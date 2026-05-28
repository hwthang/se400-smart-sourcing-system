import { useState } from "react";
import { FileCheck, Loader2, AlertCircle } from "lucide-react";
import { useStartOrderingPhase } from "../../hooks/use-contract";
import Modal from "../../../../shared/ui/modal/Modal";
import { useProcurement } from "../../../../core/blockchain/hooks/useProcurement";

export const StartOrderingButton = ({ contract }: any) => {
  const mutation = useStartOrderingPhase();

  const { startOrderingPhase } = useProcurement(contract.address);

  const [open, setOpen] = useState(false);

  const handleConfirm = async () => {
    try {
      // =====================================================
      // 1. BLOCKCHAIN TRANSACTION
      // =====================================================
      const txHash = await startOrderingPhase.mutateAsync();

      // =====================================================
      // 2. BACKEND UPDATE
      // =====================================================
      await mutation.mutateAsync({
        id: contract.id,

        data: {
          txHash,
          contractAddress: contract.address,
        },
      });

      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const isButtonDisabled = mutation.isPending;

  return (
    <>
      {contract.status === "SUPPLIERS_REGISTERED" && (
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
          {mutation.isPending ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <FileCheck className="w-3.5 h-3.5" />
          )}
          Start Ordering Phase
        </button>
      )}
      {/* TRIGGER BUTTON */}

      {/* CONFIRMATION PORTAL MODAL */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Initialize Procurement Ordering Phase"
      >
        <div className="flex flex-col space-y-4 text-left">
          {/* Business Warning Banner */}
          <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-md flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-blue-800 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wide">
                Lifecycle State Transition
              </h4>
              <p className="text-[11px] text-blue-800/90 leading-normal">
                You are about to transition the pipeline into the ordering
                stage. This operation commits finalized register manifests and
                opens operational demand logging channels.
              </p>
            </div>
          </div>

          {/* Target Metadata Display */}
          <div className="space-y-1.5 px-1 py-1">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Target Procurement Pipeline
            </div>
            <div className="text-sm font-bold text-blue-900 bg-blue-50/30 border border-blue-100 rounded px-3 py-2">
              {contract?.name || "Unnamed Procurement Instance"}
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed pt-0.5">
              Confirming this block level update restricts earlier supplier
              mutation processes and flags the entity as ready for stock
              requests.
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
              Confirm & Open Ordering
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
