import { useState } from "react";
import { useProcurement } from "../hooks/useProcurement";
import { ConfirmModal } from "../../../shared/ui/modal/ConfirmModal";

export const RegisterSupplierButton = ({ contractAddress }: any) => {
  const p = useProcurement(contractAddress);
  const [open, setOpen] = useState(false);
  const [supplier, setSupplier] = useState("");

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 border border-blue-800 text-blue-800 rounded-md"
      >
        Register Supplier
      </button>

      <ConfirmModal
        open={open}
        onClose={() => setOpen(false)}
        title="Register Supplier"
        onConfirm={async () => {
          const tx = await p.registerSupplier.mutateAsync(supplier);
          console.log("txHash:", tx);
          setOpen(false);
        }}
      >
        <input
          className="w-full border border-gray-200 rounded-md p-2"
          placeholder="0x supplier address"
          value={supplier}
          onChange={(e) => setSupplier(e.target.value)}
        />
      </ConfirmModal>
    </>
  );
};