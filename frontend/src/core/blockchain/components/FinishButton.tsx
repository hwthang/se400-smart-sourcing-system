import { useState } from "react";
import { useProcurement } from "../hooks/useProcurement";
import { ConfirmModal } from "../../../shared/ui/modal/ConfirmModal";


export const FinishButton = ({ contractAddress }: any) => {
  const p = useProcurement(contractAddress);
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-gradient-to-br from-blue-900 to-indigo-900 text-white"
      >
        Finish Contract
      </button>

      <ConfirmModal
        open={open}
        onClose={() => setOpen(false)}
        title="Finish Contract"
        onConfirm={async () => {
          const tx = await p.finish.mutateAsync();
          console.log("txHash:", tx);
          setOpen(false);
        }}
      >
        <p className="text-sm text-gray-500">
          This will close contract permanently
        </p>
      </ConfirmModal>
    </>
  );
};