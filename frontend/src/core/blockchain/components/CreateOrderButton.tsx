import { useState } from "react";
import { useProcurement } from "../hooks/useProcurement";
import { ConfirmModal } from "../../../shared/ui/modal/ConfirmModal";

export const CreateOrderButton = ({ contractAddress }: any) => {
  const p = useProcurement(contractAddress);

  const [open, setOpen] = useState(false);

  const [supplier, setSupplier] = useState("");
  const [allocationScore, setAllocationScore] = useState("");
  const [allocatedQuantity, setAllocatedQuantity] = useState("");
  const [estimatedAmount, setEstimatedAmount] = useState("");

  return (
    <>
      <button className="px-4 py-2 border border-blue-800 text-blue-800 rounded-md" onClick={() => setOpen(true)}>
        Create Order
      </button>

      <ConfirmModal
        open={open}
        onClose={() => setOpen(false)}
        title="Create Order"
        onConfirm={async () => {
          const tx = await p.createOrder.mutateAsync({
            supplier,
            allocationScore: Number(allocationScore),
            allocatedQuantity: BigInt(allocatedQuantity),
            estimatedAmount: BigInt(estimatedAmount),
          });

          console.log("txHash:", tx);
          setOpen(false);
        }}
      >
        <input
          className="w-full border p-2 rounded-md"
          placeholder="supplier"
          value={supplier}
          onChange={(e) => setSupplier(e.target.value)}
        />

        <input
          className="w-full border p-2 rounded-md"
          placeholder="allocation score"
          value={allocationScore}
          onChange={(e) => setAllocationScore(e.target.value)}
        />

        <input
          className="w-full border p-2 rounded-md"
          placeholder="allocated quantity (wei)"
          value={allocatedQuantity}
          onChange={(e) => setAllocatedQuantity(e.target.value)}
        />

        <input
          className="w-full border p-2 rounded-md"
          placeholder="estimated amount (wei)"
          value={estimatedAmount}
          onChange={(e) => setEstimatedAmount(e.target.value)}
        />
      </ConfirmModal>
    </>
  );
};