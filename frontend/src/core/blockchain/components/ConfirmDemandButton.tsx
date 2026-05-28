import { useState } from "react";
import { useProcurement } from "../hooks/useProcurement";
import { ConfirmModal } from "../../../shared/ui/modal/ConfirmModal";

const format = (ts: number) => {
  const d = new Date(ts * 1000);
  return d.toLocaleString("vi-VN");
};

export const ConfirmDemandButton = ({ contractAddress }: any) => {
  const p = useProcurement(contractAddress);

  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState("0");
  const [timestamp, setTimestamp] = useState(
    String(Math.floor(Date.now() / 1000)),
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 border border-blue-800 text-blue-800"
      >
        Confirm Demand
      </button>

      <ConfirmModal
        open={open}
        onClose={() => setOpen(false)}
        title="Confirm Demand"
        onConfirm={async () => {
          const tx = await p.confirmDemand.mutateAsync({
            quantity: BigInt(quantity),
            timestamp: BigInt(timestamp),
          });

          console.log("txHash:", tx);
          setOpen(false);
        }}
      >
        <div className="flex flex-col gap-3">
          <input
            className="border p-2"
            placeholder="Quantity (wei)"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />

          <input
            className="border p-2"
            value={timestamp}
            onChange={(e) => setTimestamp(e.target.value)}
          />

          <div className="text-sm text-gray-500">
            <div>{format(Number(timestamp))}</div>
            <div>timestamp: {timestamp}</div>
          </div>
        </div>
      </ConfirmModal>
    </>
  );
};