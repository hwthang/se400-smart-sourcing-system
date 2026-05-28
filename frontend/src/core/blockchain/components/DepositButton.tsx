import { useState } from "react";
import { useProcurement } from "../hooks/useProcurement";
import { ConfirmModal } from "../../../shared/ui/modal/ConfirmModal";

export const DepositButton = ({ contractAddress }: any) => {
  const p = useProcurement(contractAddress);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("0");

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 border border-blue-800 text-blue-800"
      >
        Deposit
      </button>

      <ConfirmModal
        open={open}
        onClose={() => setOpen(false)}
        title="Deposit Funds"
        onConfirm={async () => {
          const tx = await p.deposit.mutateAsync(BigInt(value));
          console.log("txHash:", tx);
          setOpen(false);
        }}
      >
        <div className="flex flex-col gap-2">
          <input
            className="border p-2"
            placeholder="Amount (wei)"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <p className="text-xs text-gray-500">
            Unit: wei (1 ETH = 10^18 wei)
          </p>
        </div>
      </ConfirmModal>
    </>
  );
};