import React, { useState } from "react";
import {
  CheckCircle2,
  CircleDollarSign,
  Boxes,
  Truck,
  ShieldCheck,
} from "lucide-react";
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
  // BLOCKCHAIN & API MUTATIONS
  // =========================================================
  const procurement = useProcurement(contract?.address);
  const confirmQuotation = useConfirmQuotation();

  // =========================================================
  // HANDLERS
  // =========================================================
  const handleConfirm = async () => {
    try {
      // 1. Gửi transaction lên Blockchain mạng EVM
      const txHash = await procurement.confirmSupplierQuotation.mutateAsync({
        unitPrice: quotation.unitPrice,
        minSupplyQuantity: quotation.minSupplyQuantity,
        maxSupplyQuantity: quotation.maxSupplyQuantity,
        maxDefectRate: quotation.maxDefectRate,
        maxLeadTimeDays: quotation.maxLeadTimeDays,
      });

      // 2. Đồng bộ hóa Tx Hash và địa chỉ Contract về cơ sở dữ liệu Backend
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
      console.error("Error executing quotation confirmation process:", error);
    }
  };

  const isPending =
    procurement.confirmSupplierQuotation.isPending || confirmQuotation.isPending;

  return (
    <>
      {/* TRIGGER ACTION BUTTON */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-md bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:brightness-110 hover:shadow-md active:scale-[0.98]"
      >
        <CheckCircle2 className="w-4 h-4" strokeWidth={2} />
        Confirm Quotation
      </button>

      {/* VERIFICATION SUMMARY MODAL */}
      <Modal
        open={open}
        onClose={() => !isPending && setOpen(false)} // Ngăn đóng modal khi đang ghi nhận giao dịch
        title="Confirm Supplier Quotation"
      >
        <div className="space-y-6">
          {/* CRITICAL LEDGER METRICS */}
          <div className="rounded-md border border-slate-100 bg-slate-50 p-4 space-y-4 text-left">
            
            {/* UNIT PRICE SECTION */}
            <div className="flex items-start justify-between gap-4 border-b border-dashed border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <CircleDollarSign className="w-4 h-4 text-blue-800" strokeWidth={2} />
                <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                  Unit Price
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm font-mono font-bold text-gray-900">
                  {Number(quotation?.unitPrice || 0).toLocaleString()} ETH
                </p>
              </div>
            </div>

            {/* SUPPLY CAPACITY RANGE */}
            <div className="flex items-start justify-between gap-4 border-b border-dashed border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Boxes className="w-4 h-4 text-blue-800" strokeWidth={2} />
                <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                  Supply Range
                </span>
              </div>
              <span className="text-sm font-bold text-gray-900 font-mono">
                {Number(quotation?.minSupplyQuantity || 0).toLocaleString()}
                {" → "}
                {Number(quotation?.maxSupplyQuantity || 0).toLocaleString()} units
              </span>
            </div>

            {/* DEFECT TOLERANCE LIMIT */}
            <div className="flex items-start justify-between gap-4 border-b border-dashed border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-800" strokeWidth={2} />
                <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                  Max Defect Rate
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900 font-mono">
                  {Number(quotation?.maxDefectRate || 0).toFixed(2)}%
                </p>
              </div>
            </div>

            {/* LEAD TIME CONSTRAINT */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-800" strokeWidth={2} />
                <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                  Max Lead Time
                </span>
              </div>
              <span className="text-sm font-bold text-gray-900 font-mono">
                {quotation?.maxLeadTimeDays || 0} days
              </span>
            </div>
          </div>

          {/* BLOCKCHAIN AUDIT NOTICE */}
          <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900 text-left">
            This action will confirm the supplier quotation on-chain and synchronize the blockchain transaction with the backend system.
          </div>

          {/* DIALOG ACTION INTENTS */}
          <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={() => setOpen(false)}
              disabled={isPending}
              className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-700 disabled:opacity-40"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              disabled={isPending}
              className="rounded-md bg-gradient-to-br from-blue-900 to-indigo-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all disabled:opacity-40"
            >
              {isPending ? "Confirming..." : "Confirm Quotation"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ConfirmQuotationButton;