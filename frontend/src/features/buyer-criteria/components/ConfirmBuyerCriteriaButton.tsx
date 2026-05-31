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

  // Blockchain connection hook
  const { confirmBuyerCriteria } = useProcurement(contract?.address);

  // Kiểm tra trạng thái pending tổng hợp từ cả ví Web3 và mutation backend
  const isPendingProcessing =
    confirmBuyerCriteria.isPending || confirmCriteria.isPending;

  // =========================================================
  // FORMATTERS (Hiển thị số thực trực tiếp theo định dạng mới)
  // =========================================================
  const allocationPercent = useMemo(() => {
    const raw = Number(criteria?.maxAllocationPercent) || 0;
    return raw.toFixed(2);
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
      {/* BUTTON TRIGGER - Chuyển từ Emerald sang Brand Gradient Blue độc quyền */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center justify-center gap-2 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white font-medium px-4 py-2 rounded-md shadow-sm transition-all duration-200 hover:shadow-md hover:brightness-110 active:scale-[0.98] text-sm"
      >
        <CheckCircle2 className="w-4 h-4 text-white" strokeWidth={2} />
        <span>Confirm Criteria</span>
      </button>

      {/* CONFIRMATION MODAL */}
      <Modal
        open={open}
        onClose={() => !isPendingProcessing && setOpen(false)}
        title="Confirm Buyer Criteria"
      >
        <div className="space-y-5 text-left">
          
          {/* 1. TOP EXPLANATION BANNER (Borderless Subtle Background) */}
          <div className="rounded-md bg-blue-50/50 p-4 space-y-1">
            <p className="text-sm font-bold text-blue-900">
              Buyer Allocation Criteria Audit
            </p>
            <p className="text-xs leading-relaxed text-gray-500">
              Please double check the parameters below. Once validated, this allocation blueprint will govern automated source routing on the smart contract.
            </p>
          </div>

          {/* 2. CRITERIA SPECS MATRIX (Bảng thông số phẳng phẳng tuyệt đối) */}
          <div className="space-y-3.5 rounded-md bg-gradient-to-br from-white to-blue-50/20 p-4">
            
            {/* MIN PURCHASE QUANTITY ROW */}
            <div className="flex items-center justify-between gap-4 pb-3 border-b border-gray-100/70">
              <div className="flex items-center gap-2">
                <Boxes className="w-4 h-4 text-blue-800" strokeWidth={2} />
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Min Purchase Quantity
                </span>
              </div>
              <span className="text-sm font-bold text-gray-900">
                {Number(criteria?.minPurchaseQuantity || 0).toLocaleString()}{" "}
                <span className="text-xs font-medium text-gray-500">units</span>
              </span>
            </div>

            {/* MAX ALLOCATION PERCENT ROW */}
            <div className="flex items-center justify-between gap-4 pb-3 border-b border-gray-100/70">
              <div className="flex items-center gap-2">
                <Percent className="w-4 h-4 text-blue-800" strokeWidth={2} />
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Max Allocation Percent
                </span>
              </div>
              <span className="text-sm font-bold text-gray-900">
                {allocationPercent}%
              </span>
            </div>

            {/* DATA ORIGIN STATUS */}
            <div className="flex items-center justify-between gap-4 pt-0.5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-800" strokeWidth={2} />
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Current Draft Status
                </span>
              </div>
              <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-bold font-mono text-blue-800 uppercase">
                {criteria?.status || "PENDING"}
              </span>
            </div>
          </div>

          {/* 3. BLOCKCHAIN IMMUTABILITY WARNING (Quy đổi Alert sang dải màu hệ thống dịu nhẹ) */}
          <div className="rounded-md bg-blue-50 p-4 flex gap-3">
            <AlertTriangle className="w-5 h-5 text-blue-800 shrink-0 mt-0.5" strokeWidth={2} />
            <div className="space-y-1">
              <p className="text-xs font-bold text-blue-900 uppercase tracking-wide">
                Immutability Warning
              </p>
              <p className="text-xs text-blue-800 leading-relaxed">
                This process triggers a decentralized ledger transaction. Confirming these values will incur gas costs, seal parameters on-chain, and lock edits on the system dashboard.
              </p>
            </div>
          </div>

          {/* 4. ACTION BUTTON CONTROLS */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              disabled={isPendingProcessing}
              onClick={() => setOpen(false)}
              className="flex items-center justify-center bg-white text-blue-800 font-medium px-4 py-2 rounded-md transition-all duration-200 hover:bg-blue-50 active:scale-[0.98] text-sm disabled:opacity-30 disabled:pointer-events-none"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              disabled={isPendingProcessing}
              className="flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white font-medium px-5 py-2 rounded-md shadow-sm transition-all duration-200 hover:brightness-110 active:scale-[0.98] text-sm disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 disabled:pointer-events-none flex items-center gap-1.5"
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