import { useState } from "react";
import { useProcurement } from "../hooks/useProcurement";
import { ConfirmModal } from "../../../shared/ui/modal/ConfirmModal";

export const CompleteInspectionButton = ({ contractAddress }: any) => {
  const p = useProcurement(contractAddress);

  const [open, setOpen] = useState(false);
  const [supplier, setSupplier] = useState("");
  const [defectRate, setDefectRate] = useState("0");

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 border border-blue-800"
      >
        Complete Inspection
      </button>

      <ConfirmModal
        open={open}
        onClose={() => setOpen(false)}
        title="Complete Inspection"
        onConfirm={async () => {
          const tx = await p.completeInspection.mutateAsync({
            supplier,
            defectRate: Number(defectRate),
          });

          console.log("txHash:", tx);
          setOpen(false);
        }}
      >
        <input
          className="border p-2"
          placeholder="supplier"
          value={supplier}
          onChange={(e) => setSupplier(e.target.value)}
        />

        <input
          className="border p-2"
          placeholder="defect rate (%)"
          value={defectRate}
          onChange={(e) => setDefectRate(e.target.value)}
        />

        <p className="text-xs text-gray-500">
          Unit: %
        </p>
      </ConfirmModal>
    </>
  );
};