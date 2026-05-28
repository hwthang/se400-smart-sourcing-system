import { useState } from "react";
import { useProcurement } from "../hooks/useProcurement";
import { ConfirmModal } from "../../../shared/ui/modal/ConfirmModal";

export const ConfirmBuyerCriteriaButton = ({ contractAddress }: any) => {
  const p = useProcurement(contractAddress);

  const [open, setOpen] = useState(false);
  const [supplier, setSupplier] = useState("");
  const [minPurchaseQuantity, setMinPurchaseQuantity] = useState("");
  const [maxAllocationPercent, setMaxAllocationPercent] = useState("");

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 border border-blue-800 text-blue-800 rounded-md"
      >
        Confirm Buyer Criteria
      </button>

      <ConfirmModal
        open={open}
        onClose={() => setOpen(false)}
        title="Confirm Buyer Criteria"
        onConfirm={async () => {
          const tx = await p.confirmBuyerCriteria.mutateAsync({
            supplier,
            minPurchaseQuantity: BigInt(minPurchaseQuantity),
            maxAllocationPercent: Number(maxAllocationPercent),
          });

          console.log("txHash:", tx);
          setOpen(false);
        }}
      >
        <input
          className="w-full border border-gray-200 p-2 rounded-md"
          placeholder="supplier address"
          value={supplier}
          onChange={(e) => setSupplier(e.target.value)}
        />

        <input
          className="w-full border border-gray-200 p-2 rounded-md"
          placeholder="min purchase quantity (wei)"
          value={minPurchaseQuantity}
          onChange={(e) => setMinPurchaseQuantity(e.target.value)}
        />

        <input
          className="w-full border border-gray-200 p-2 rounded-md"
          placeholder="max allocation (%)"
          value={maxAllocationPercent}
          onChange={(e) => setMaxAllocationPercent(e.target.value)}
        />
      </ConfirmModal>
    </>
  );
};