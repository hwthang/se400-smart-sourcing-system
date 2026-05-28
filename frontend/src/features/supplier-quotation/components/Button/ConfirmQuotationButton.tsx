import React, { useState } from "react";

import {
  CheckCircle2,
  CircleDollarSign,
  Boxes,
  Truck,
  ShieldCheck,
} from "lucide-react";

import { formatEther } from "ethers";

import Modal from "../../../../shared/ui/modal/Modal";

import { useConfirmQuotation } from "../../hooks/use-supplier-quotation";
import { useProcurement } from "../../../../core/blockchain/hooks/useProcurement";

type Props = {
  contract: any;
  registration: any;
};

const ConfirmQuotationButton = ({ contract, registration }: Props) => {
  const quotation = registration?.quotation;

  const [open, setOpen] = useState(false);

  // =========================================================
  // BLOCKCHAIN
  // =========================================================
  const procurement = useProcurement(contract?.address);

  // =========================================================
  // API
  // =========================================================
  const confirmQuotation = useConfirmQuotation();

  // =========================================================
  // HELPERS
  // =========================================================
  const ethPreview = (() => {
    try {
      return Number(
        formatEther(quotation?.unitPrice?.toString() || "0"),
      ).toLocaleString(undefined, {
        maximumFractionDigits: 9,
      });
    } catch {
      return "0";
    }
  })();

  // =========================================================
  // CONFIRM
  // =========================================================
  const handleConfirm = async () => {
    try {
      // =====================================
      // 1. BLOCKCHAIN
      // =====================================
      const txHash = await procurement.confirmSupplierQuotation.mutateAsync({
        unitPrice: BigInt(quotation.unitPrice),

        minSupplyQuantity: BigInt(quotation.minSupplyQuantity),

        maxSupplyQuantity: BigInt(quotation.maxSupplyQuantity),

        maxDefectRate: BigInt(quotation.maxDefectRate),

        maxLeadTimeDays: BigInt(quotation.maxLeadTimeDays),
      });

      // =====================================
      // 2. BACKEND
      // =====================================
      await confirmQuotation.mutateAsync({
        id: quotation.id,

        contractId: contract.id,

        data: {
          txHash,

          contractAddress: contract.address,
        },
      });

      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {/* BUTTON */}
      <button
        type="button"
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
          text-sm
          font-medium
          text-white
          shadow-sm
          transition-all
          duration-200
          hover:brightness-110
          hover:shadow-md
          active:scale-[0.98]
        "
      >
        <CheckCircle2 className="w-4 h-4" strokeWidth={2} />
        Confirm Quotation
      </button>

      {/* MODAL */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Confirm Supplier Quotation"
      >
        <div className="space-y-6">
          {/* SUMMARY */}
          <div
            className="
              rounded-md
              border
              border-slate-100
              bg-slate-50
              p-4
              space-y-4
            "
          >
            {/* PRICE */}
            <div
              className="
                flex
                items-start
                justify-between
                gap-4
                border-b
                border-dashed
                border-slate-200
                pb-3
              "
            >
              <div className="flex items-center gap-2">
                <CircleDollarSign
                  className="w-4 h-4 text-blue-800"
                  strokeWidth={2}
                />

                <span
                  className="
                    text-xs
                    font-medium
                    uppercase
                    tracking-wider
                    text-gray-500
                  "
                >
                  Unit Price
                </span>
              </div>

              <div className="text-right">
                <p
                  className="
                    text-sm
                    font-mono
                    font-bold
                    text-gray-900
                  "
                >
                  {Number(quotation.unitPrice).toLocaleString()} wei
                </p>

                <p
                  className="
                    text-xs
                    font-semibold
                    text-emerald-700
                  "
                >
                  ≈ {ethPreview} ETH
                </p>
              </div>
            </div>

            {/* SUPPLY */}
            <div
              className="
                flex
                items-start
                justify-between
                gap-4
                border-b
                border-dashed
                border-slate-200
                pb-3
              "
            >
              <div className="flex items-center gap-2">
                <Boxes className="w-4 h-4 text-blue-800" strokeWidth={2} />

                <span
                  className="
                    text-xs
                    font-medium
                    uppercase
                    tracking-wider
                    text-gray-500
                  "
                >
                  Supply Range
                </span>
              </div>

              <span
                className="
                  text-sm
                  font-bold
                  text-gray-900
                "
              >
                {Number(quotation.minSupplyQuantity).toLocaleString()}
                {" → "}
                {Number(quotation.maxSupplyQuantity).toLocaleString()} units
              </span>
            </div>

            {/* DEFECT */}
            <div
              className="
                flex
                items-start
                justify-between
                gap-4
                border-b
                border-dashed
                border-slate-200
                pb-3
              "
            >
              <div className="flex items-center gap-2">
                <ShieldCheck
                  className="w-4 h-4 text-blue-800"
                  strokeWidth={2}
                />

                <span
                  className="
                    text-xs
                    font-medium
                    uppercase
                    tracking-wider
                    text-gray-500
                  "
                >
                  Max Defect Rate
                </span>
              </div>

              <div className="text-right">
                <p
                  className="
                    text-sm
                    font-bold
                    text-gray-900
                  "
                >
                  {(Number(quotation.maxDefectRate) / 100).toFixed(2)}%
                </p>

                <p
                  className="
                    text-[10px]
                    font-mono
                    text-slate-400
                  "
                >
                  Contract Value: {quotation.maxDefectRate}
                </p>
              </div>
            </div>

            {/* LEAD TIME */}
            <div
              className="
                flex
                items-start
                justify-between
                gap-4
              "
            >
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-800" strokeWidth={2} />

                <span
                  className="
                    text-xs
                    font-medium
                    uppercase
                    tracking-wider
                    text-gray-500
                  "
                >
                  Max Lead Time
                </span>
              </div>

              <span
                className="
                  text-sm
                  font-bold
                  text-gray-900
                "
              >
                {quotation.maxLeadTimeDays} days
              </span>
            </div>
          </div>

          {/* WARNING */}
          <div
            className="
              rounded-md
              border
              border-amber-200
              bg-amber-50
              p-4
              text-xs
              text-amber-900
            "
          >
            This action will confirm the supplier quotation on-chain and
            synchronize the blockchain transaction with the backend system.
          </div>

          {/* ACTIONS */}
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
              onClick={() => setOpen(false)}
              className="
                rounded-md
                bg-white
                px-4
                py-2
                text-sm
                font-medium
                text-gray-500
                transition-colors
                hover:text-gray-700
              "
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              disabled={
                procurement.confirmSupplierQuotation.isPending ||
                confirmQuotation.isPending
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
                shadow-sm
                transition-all
                disabled:opacity-40
              "
            >
              {procurement.confirmSupplierQuotation.isPending ||
              confirmQuotation.isPending
                ? "Confirming..."
                : "Confirm Quotation"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ConfirmQuotationButton;
