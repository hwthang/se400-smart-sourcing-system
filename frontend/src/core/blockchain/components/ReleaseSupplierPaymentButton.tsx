import { useState } from "react";
import { useProcurement } from "../hooks/useProcurement";
import { ConfirmModal } from "../../../shared/ui/modal/ConfirmModal";

export const ReleasePaymentButton = ({ contractAddress }: any) => {
  const p = useProcurement(contractAddress);
  const [open, setOpen] = useState(false);
  const [supplier, setSupplier] = useState("");

  return (
    <>
      <button
        className="px-4 py-2 bg-gradient-to-br from-blue-900 to-indigo-900 text-white"
        onClick={() => setOpen(true)}
      >
        Release Payment
      </button>

      <ConfirmModal
        open={open}
        onClose={() => setOpen(false)}
        title="Release Payment"
        onConfirm={async () => {
          const tx = await p.releaseSupplierPayment.mutateAsync(
            supplier,
          );

          console.log("txHash:", tx);
          setOpen(false);
        }}
      >
        <input
          className="border p-2"
          placeholder="supplier address"
          value={supplier}
          onChange={(e) => setSupplier(e.target.value)}
        />
      </ConfirmModal>
    </>
  );
};