// components/Button/SubmitQuotationButton.tsx

import React, { useState } from "react";

import { SendHorizonal } from "lucide-react";

import Modal from "../../../../shared/ui/modal/Modal";

import {
  useSubmitQuotation,
} from "../../hooks/use-supplier-quotation";

type Props = {
  registration: any;
};

const SubmitQuotationButton = ({
  registration,
}: Props) => {
  const submitQuotation =
    useSubmitQuotation();

  const [open, setOpen] =
    useState(false);

  const quotation =
    registration?.quotation;

  const handleSubmit = () => {
    submitQuotation.mutate(
      {
        id: quotation.id,
        contractId:
          registration.contractId,
      },
      {
        onSuccess: () => {
          setOpen(false);
        },
      },
    );
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="
          rounded-md
          bg-gradient-to-br
          from-blue-900
          to-indigo-900
          px-4
          py-2
          text-sm
          font-medium
          text-white
          shadow-sm
          transition-all
          hover:brightness-110
        "
      >
        <div className="flex items-center gap-2">
          <SendHorizonal
            className="w-4 h-4"
            strokeWidth={2}
          />
          Submit
        </div>
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Submit Quotation"
      >
        <div className="space-y-6">
          <div
            className="
              rounded-md
              border
              border-blue-100
              bg-blue-50
              p-4
              text-sm
              text-gray-700
            "
          >
            You are about to officially
            submit this supplier quotation
            for review and allocation.
          </div>

          <div
            className="
              flex
              justify-end
              gap-2
              border-t
              border-gray-100
              pt-4
            "
          >
            <button
              type="button"
              onClick={() =>
                setOpen(false)
              }
              className="
                rounded-md
                px-4
                py-2
                text-sm
                text-gray-500
              "
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={
                submitQuotation.isPending
              }
              className="
                rounded-md
                bg-gradient-to-br
                from-blue-900
                to-indigo-900
                px-4
                py-2
                text-sm
                font-medium
                text-white
                disabled:opacity-40
              "
            >
              {submitQuotation.isPending
                ? "Submitting..."
                : "Confirm Submit"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SubmitQuotationButton;