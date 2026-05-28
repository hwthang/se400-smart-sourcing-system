import { useState } from "react";
import { useProcurement } from "../hooks/useProcurement";
import { ConfirmModal } from "../../../shared/ui/modal/ConfirmModal";

export const StartExecutingButton = ({ contractAddress }: any) => {
  const p = useProcurement(contractAddress);

  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 border border-blue-800 text-blue-800 rounded-md"
      >
        Start Executing
      </button>

      <ConfirmModal
        open={open}
        onClose={() => setOpen(false)}
        title="Start Executing Phase"
        onConfirm={async () => {
          const tx = await p.startExecutingPhase.mutateAsync();
          console.log("txHash:", tx);
          setOpen(false);
        }}
      >
        Move contract to EXECUTING phase
      </ConfirmModal>
    </>
  );
};