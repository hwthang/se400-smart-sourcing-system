import { useState } from "react";
import { useProcurement } from "../hooks/useProcurement";
import { ConfirmModal } from "../../../shared/ui/modal/ConfirmModal";

export const RegisterCustomerButton = ({ contractAddress }: any) => {
  const p = useProcurement(contractAddress);
  const [open, setOpen] = useState(false);
  const [address, setAddress] = useState("");

  return (
    <>
      <button
        className="px-4 py-2 border border-blue-800 text-blue-800 rounded-md"
        onClick={() => setOpen(true)}
      >
        Register Customer
      </button>

      <ConfirmModal
        open={open}
        onClose={() => setOpen(false)}
        title="Register Customer"
        onConfirm={async () => {
          const tx = await p.registerCustomer.mutateAsync(address);
          console.log("txHash:", tx);
          setOpen(false);
        }}
      >
        <input
          className="w-full border border-gray-200 rounded-md p-2"
          placeholder="0x customer address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </ConfirmModal>
    </>
  );
};
