// components/Button/ConfirmBuyerCriteriaButton.tsx

import React, { useMemo, useState } from "react";
import {
  ShieldCheck,
  Percent,
  Boxes,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { useConfirmCriteria } from "../hooks/use-buyer-criteria";
import { useProcurement } from "../../../core/blockchain/hooks/useProcurement";
import Modal from "../../../shared/ui/modal/Modal";

type Props = {
  registration: any;
  contract: any;
};

const ConfirmBuyerCriteriaButton = ({ registration, contract }: Props) => {
  const criteria = registration?.criteria;
  const [open, setOpen] = useState(false);

  const confirmCriteria = useConfirmCriteria();
  console.log(contract?.address);
  // Blockchain connection hook
  const { confirmBuyerCriteria } = useProcurement(contract?.address);

  // Kiểm tra trạng thái pending tổng hợp từ cả ví Web3 và mutation backend
  const isPendingProcessing =
    confirmBuyerCriteria.isPending || confirmCriteria.isPending;

  // =========================================================
  // FORMATTERS
  // =========================================================
  const allocationPercent = useMemo(() => {
    const raw = Number(criteria?.maxAllocationPercent) || 0;
    return (raw / 100).toFixed(2);
  }, [criteria?.maxAllocationPercent]);

  // =========================================================
  // HANDLER (Sử dụng luồng an toàn Web3 -> Backend API)
  // =========================================================
  const handleConfirm = async () => {
    try {
      // 1. BLOCKCHAIN TRANSACTION CALL
      const txHash = await confirmBuyerCriteria.mutateAsync({
        supplier: registration?.supplier?.walletAddress,
        minPurchaseQuantity: BigInt(criteria?.minPurchaseQuantity || 0),
        maxAllocationPercent: BigInt(criteria?.maxAllocationPercent || 0),
      });

      // 2. BACKEND SYNCHRONIZATION WITH TRANSACTION HASH
      if (txHash) {
        await confirmCriteria.mutateAsync({
          id: criteria?.id,
          contractId: contract?.id,
          data: {
            txHash,
            contractAddress: contract?.address,
          },
        });
      }

      setOpen(false);
    } catch (error) {
      console.error(
        "Blockchain execution failed or user rejected signature:",
        error,
      );
    }
  };

  // Tránh render thừa nếu không có tiêu chí dữ liệu nào được thiết lập
  if (!criteria) return null;

  return (
    <>
      {/* BUTTON TRIGGER */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="
          flex items-center gap-2 rounded-md bg-gradient-to-br
          from-emerald-700 to-emerald-600 px-4 py-2 text-sm
          font-medium text-white shadow-sm transition-all duration-200
          hover:brightness-110 hover:shadow-md active:scale-[0.98]
        "
      >
        <CheckCircle2 className="w-4 h-4" strokeWidth={2} />
        Confirm Criteria
      </button>

      {/* CONFIRMATION MODAL */}
      <Modal
        open={open}
        onClose={() => !isPendingProcessing && setOpen(false)}
        title="Confirm Buyer Criteria"
      >
        <div className="space-y-5 text-left">
          {/* TOP EXPLANATION BANNER */}
          <div className="rounded-md border border-blue-100 bg-blue-50/50 p-4 space-y-1">
            <p className="text-sm font-bold text-blue-900">
              Buyer Allocation Criteria Audit
            </p>
            <p className="text-xs leading-relaxed text-gray-500">
              Please double check the parameters below. Once validated, this
              allocation blueprint will govern automated source routing on the
              smart contract.
            </p>
          </div>

          {/* CRITERIA SPECS MATRIX */}
          <div className="space-y-3.5 rounded-md border border-slate-100 bg-slate-50 p-4 font-sans">
            {/* MIN PURCHASE QUANTITY ROW */}
            <div className="flex items-center justify-between gap-4 border-b border-dashed border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Boxes className="w-4 h-4 text-blue-800" strokeWidth={2} />
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Min Purchase Quantity
                </span>
              </div>
              <span className="text-sm font-black text-slate-800">
                {Number(criteria?.minPurchaseQuantity || 0).toLocaleString()}{" "}
                <span className="text-xs font-medium text-gray-400">units</span>
              </span>
            </div>

            {/* MAX ALLOCATION PERCENT ROW */}
            <div className="flex items-center justify-between gap-4 border-b border-dashed border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Percent className="w-4 h-4 text-blue-800" strokeWidth={2} />
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Max Allocation Percent
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-slate-800">
                  {allocationPercent}%
                </p>
                <p className="text-[10px] font-mono font-medium text-slate-400 mt-0.5">
                  Basis Point: {criteria?.maxAllocationPercent || 0} / 10000
                </p>
              </div>
            </div>

            {/* DATA ORIGIN STATUS */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <ShieldCheck
                  className="w-4 h-4 text-blue-800"
                  strokeWidth={2}
                />
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Current Draft Status
                </span>
              </div>
              <span className="rounded bg-blue-100/80 px-2 py-0.5 text-xs font-bold font-mono text-blue-900 uppercase">
                {criteria?.status || "PENDING"}
              </span>
            </div>
          </div>

          {/* BLOCKCHAIN CRITICAL IMMUTABILITY WARNING */}
          <div className="rounded-md border border-amber-200 bg-amber-50/60 p-4 flex gap-3">
            <AlertTriangle
              className="w-5 h-5 text-amber-800 shrink-0 mt-0.5"
              strokeWidth={2}
            />
            <div className="space-y-1">
              <p className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                Immutability Warning
              </p>
              <p className="text-xs text-amber-800 leading-relaxed">
                This process triggers a decentralized ledger transaction.
                Confirming these values will incur gas costs, seal parameters
                on-chain, and lock edits on the system dashboard.
              </p>
            </div>
          </div>

          {/* ACTION BUTTON CONTROLS */}
          <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
            <button
              type="button"
              disabled={isPendingProcessing}
              onClick={() => setOpen(false)}
              className="
                rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-500 
                transition-colors hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed
              "
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              disabled={isPendingProcessing}
              className="
                rounded-md bg-gradient-to-br from-emerald-700 to-emerald-600 px-5 py-2 text-sm
                font-bold text-white shadow-sm transition-all hover:brightness-110
                disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5
              "
            >
              {isPendingProcessing ? (
                <>
                  <span className="inline-block animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>Seal & Confirm</span>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ConfirmBuyerCriteriaButton;
