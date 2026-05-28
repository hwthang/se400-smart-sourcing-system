// components/ConfirmOrderButton.tsx

import { useState } from "react";

import { Check } from "lucide-react";

import Modal from "../../../shared/ui/modal/Modal";

import { useConfirmOrder } from "../hooks/use-order";

type Props = {
  orderId: string;
};

const ConfirmOrderButton = ({
  orderId,
}: Props) => {
  const [open, setOpen] =
    useState(false);

  const confirmOrder =
    useConfirmOrder();

  const handleConfirm =
    async () => {
      await confirmOrder.mutateAsync(
        orderId,
      );

      setOpen(false);
    };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="
          flex
          items-center
          gap-2
          rounded-md
          bg-gradient-to-br
          from-blue-900
          via-blue-800
          to-indigo-900
          px-4
          py-2
          text-white
          font-medium
          shadow-sm
          transition-all
          duration-200
          hover:shadow-md
        "
      >
        <Check
          className="w-4 h-4"
          strokeWidth={2}
        />

        <span>
          Confirm Order
        </span>
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Confirm Order"
      >
        <div className="flex flex-col gap-6">
          <div
            className="
              rounded-md
              bg-blue-50/40
              p-4
            "
          >
            <p className="text-sm text-gray-900">
              Are you sure you want
              to confirm this order?
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() =>
                setOpen(false)
              }
              className="
                rounded-md
                bg-white
                px-4
                py-2
                text-blue-800
                font-medium
                hover:bg-blue-50
              "
            >
              Cancel
            </button>

            <button
              onClick={
                handleConfirm
              }
              disabled={
                confirmOrder.isPending
              }
              className="
                rounded-md
                bg-gradient-to-br
                from-blue-900
                via-blue-800
                to-indigo-900
                px-4
                py-2
                text-white
                font-medium
                shadow-sm
                disabled:opacity-50
              "
            >
              Confirm
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ConfirmOrderButton;