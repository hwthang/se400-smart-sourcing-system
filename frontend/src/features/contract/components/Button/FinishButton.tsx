import { useState } from "react";
import { FileCheck, Loader2, AlertCircle } from "lucide-react";
import Modal from "../../../../shared/ui/modal/Modal";
import { useProcurement } from "../../../../core/blockchain/hooks/useProcurement";
import { useFinishContract } from "../../hooks/use-contract";

export const FinishButton = ({ contract }: any) => {
  const [open, setOpen] = useState(false);

  const procurement = useProcurement(contract?.address);
  const finishContract = useFinishContract();

  const handleConfirm = async () => {
    try {
      // =====================================
      // 1. BLOCKCHAIN
      // =====================================
      const txHash = await procurement.finish.mutateAsync();

      // =====================================
      // 2. BACKEND SYNC
      // =====================================
      await finishContract.mutateAsync({
        id: contract.id,
        data: {
          txHash,
          contractAddress: contract.address,
        },
      });

      setOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const isLoading =
    procurement.finish.isPending || finishContract.isPending;

  return (
    <>
      {contract.status === "EXECUTING" && (
        <button
          type="button"
          disabled={isLoading}
          onClick={() => setOpen(true)}
          className="
            w-full md:w-auto flex-grow
            bg-white hover:bg-rose-50/50
            text-rose-600 border border-rose-200
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
            <FileCheck className="w-3.5 h-3.5" />
          )}
          Finish Contract
        </button>
      )}

      {/* MODAL */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Finalize & Close Procurement Lifecycle"
      >
        <div className="flex flex-col space-y-4 text-left">
          <div className="p-3 bg-rose-50 border border-rose-100 rounded-md flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-rose-900 uppercase tracking-wide">
                Irreversible Lifecycle Termination
              </h4>
              <p className="text-[11px] text-rose-800 leading-normal">
                This action will permanently close the procurement contract.
              </p>
            </div>
          </div>

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
              disabled={isLoading}
              className="
                px-4 py-2 text-xs font-bold rounded shadow-sm transition-all
                bg-gradient-to-br from-rose-700 via-rose-600 to-red-800 
                hover:from-rose-800 hover:to-red-900 text-white 
                flex items-center gap-1.5
              "
            >
              {isLoading ? "Processing..." : "Confirm & Settle Lifecycle"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};