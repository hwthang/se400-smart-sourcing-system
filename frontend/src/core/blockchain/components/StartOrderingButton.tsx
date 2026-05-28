import { useState } from "react";
import { useProcurement } from "../hooks/useProcurement";
import { ConfirmModal } from "../../../shared/ui/modal/ConfirmModal";

export const StartOrderingButton = ({ contractAddress }: any) => {
  const p = useProcurement(contractAddress);
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="px-4 py-2 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white rounded-md"
        onClick={() => setOpen(true)}
      >
        Start Ordering
      </button>

      <ConfirmModal
        open={open}
        onClose={() => setOpen(false)}
        title="Start Ordering Phase"
        onConfirm={async () => {
          const tx = await p.startOrderingPhase.mutateAsync();
          console.log("txHash:", tx);
          setOpen(false);
        }}
      >
        <p className="text-sm text-gray-500">Move contract to ORDERING phase</p>
      </ConfirmModal>
    </>
  );
};
