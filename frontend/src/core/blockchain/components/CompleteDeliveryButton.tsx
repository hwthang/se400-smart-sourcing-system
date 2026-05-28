import { useState } from "react";
import { useProcurement } from "../hooks/useProcurement";
import { ConfirmModal } from "../../../shared/ui/modal/ConfirmModal";

export const CompleteDeliveryButton = ({ contractAddress }: any) => {
  const p = useProcurement(contractAddress);

  const [open, setOpen] = useState(false);
  const [supplier, setSupplier] = useState("");
  const [timestamp, setTimestamp] = useState(
    String(Math.floor(Date.now() / 1000)),
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 border border-blue-800"
      >
        Complete Delivery
      </button>

      <ConfirmModal
        open={open}
        onClose={() => setOpen(false)}
        title="Complete Delivery"
        onConfirm={async () => {
          const tx = await p.completeDelivery.mutateAsync({
            supplier,
            deliveryTimestamp: BigInt(timestamp),
          });

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

        <input
          className="border p-2"
          value={timestamp}
          onChange={(e) => setTimestamp(e.target.value)}
        />
      </ConfirmModal>
    </>
  );
};