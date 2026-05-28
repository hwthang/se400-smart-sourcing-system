// components/Button/ApproveQuotationButton.tsx

import React, { useState } from "react";

import { BadgeCheck } from "lucide-react";

import Modal from "../../../../shared/ui/modal/Modal";

import {
  useApproveQuotation,
} from "../../hooks/use-supplier-quotation";

type Props = {
  registration: any;
};

const ApproveQuotationButton = ({
  registration,
}: Props) => {
  const approveQuotation =
    useApproveQuotation();

  const [open, setOpen] =
    useState(false);

  const quotation =
    registration?.quotation;

  const handleApprove = () => {
    approveQuotation.mutate(
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
          bg-emerald-600
          px-4
          py-2
          text-sm
          font-medium
          text-white
          shadow-sm
          transition-all
          hover:bg-emerald-700
        "
      >
        <div className="flex items-center gap-2">
          <BadgeCheck
            className="w-4 h-4"
            strokeWidth={2}
          />
          Approve
        </div>
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Approve Quotation"
      >
        <div className="space-y-6">
          <div
            className="
              rounded-md
              border
              border-emerald-100
              bg-emerald-50
              p-4
              text-sm
              text-emerald-700
            "
          >
            Approving this quotation means
            the supplier proposal is accepted
            for the next workflow stage.
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
              onClick={handleApprove}
              disabled={
                approveQuotation.isPending
              }
              className="
                rounded-md
                bg-emerald-600
                px-4
                py-2
                text-sm
                font-medium
                text-white
                disabled:opacity-40
              "
            >
              {approveQuotation.isPending
                ? "Approving..."
                : "Confirm Approve"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ApproveQuotationButton;