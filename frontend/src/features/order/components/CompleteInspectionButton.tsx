// components/Inspection/CompleteInspectionButton.tsx

import React, { useState } from "react";
import { ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react";
import Modal from "../../../shared/ui/modal/Modal";
import { useCompleteInspection as useCompleteInspectionBackend } from "../hooks/use-order";
import { useProcurement } from "../../../core/blockchain/hooks/useProcurement";

type Props = {
  contract: {
    id: string;
    address: string;
  };
  registration: {
    supplier?: {
      walletAddress: string;
    };
    order?: {
      id: string;
    };
  };
};

const CompleteInspectionButton = ({ contract, registration }: Props) => {
  const [open, setOpen] = useState(false);
  const [percentValue, setPercentValue] = useState(""); // Quản lý dạng chuỗi % trực tiếp từ client

  // =========================================================
  // CORE BLOCKCHAIN & BACKEND ASYNC MUTATIONS
  // =========================================================
  const procurement = useProcurement(contract?.address);
  const backend = useCompleteInspectionBackend();

  const isChainPending = procurement.completeInspection.isPending;
  const isBackendPending = backend.isPending;
  const isProcessing = isChainPending || isBackendPending;

  // Regex kiểm soát chặt chẽ định dạng số thập phân từ 0.00 đến 100.00
  const percentRegex = /^(100(\.0{0,2})?|[0-9]{0,2}(\.[0-9]{0,2})?)$/;

  const handlePercentChange = (val: string) => {
    if (val === "") {
      setPercentValue("");
      return;
    }
    if (percentRegex.test(val)) {
      setPercentValue(val);
    }
  };

  // =========================================================
  // HYBRID STATE TRANSACTION PIPELINE
  // =========================================================
  const handleConfirm = async () => {
    const floatPercent = parseFloat(percentValue);
    if (
      percentValue === "" ||
      isNaN(floatPercent) ||
      floatPercent < 0 ||
      floatPercent > 100 ||
      !registration?.supplier?.walletAddress
    ) return;

    try {
      // Tự động quy đổi ngược từ phần trăm thực tế sang cơ số Điểm cơ sở (1% = 100 BPS)
      // Sử dụng Math.round để triệt tiêu sai số dấu phẩy động của JavaScript
      const bpsValue = Math.round(floatPercent * 100);
      const defectRate = BigInt(bpsValue); // Bản đồ hóa trực tiếp sang cấu trúc Solidity uint256

      // 1. EXECUTE ON-CHAIN BLOCKCHAIN TRANSACTION WRITER
      const txHash = await procurement.completeInspection.mutateAsync({
        supplier: registration.supplier.walletAddress,
        defectRate,
      });

      // 2. BACKEND LEDGER RECONCILIATION SYNCHRONIZATION
      await backend.mutateAsync({
        id: registration.order?.id,
        contractId: contract.id,
        data: {
          txHash,
          contractAddress: contract.address,
        },
      });

      // Reset state boundaries upon atomic completion loop
      setOpen(false);
      setPercentValue("");
    } catch (error) {
      console.error("Fulfillment evaluation pipeline failed:", error);
    }
  };

  return (
    <>
      {/* TRIGGER CONTROL - Đồng bộ chuỗi màu Brand Gradient Blue hệ thống */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center justify-center gap-2 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white font-medium px-4 py-2 rounded-md shadow-sm transition-all duration-200 hover:shadow-md hover:brightness-110 active:scale-[0.98] text-sm"
      >
        <ShieldCheck className="w-4 h-4 text-white" strokeWidth={2} />
        <span>Complete Inspection</span>
      </button>

      {/* COMPLIANCE AUDIT MODAL */}
      <Modal
        open={open}
        onClose={() => !isProcessing && setOpen(false)}
        title="Finalize Quality Inspection Ledger"
      >
        <div className="space-y-5 text-left">
          
          {/* 1. HARD VALIDATION WARNING BANNER (Khối phẳng PureBlue nhạt, loại bỏ border cũ) */}
          <div className="rounded-md bg-blue-50/50 p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-800 shrink-0 mt-0.5" strokeWidth={2} />
            <div className="space-y-1">
              <p className="text-xs font-bold text-blue-900 uppercase tracking-wide">
                Direct Percentage Modifiers
              </p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Enter the final audited defect distribution parameter directly. The interface restriction maintains boundary alignment strictly bounded between <span className="font-semibold text-gray-900">0.00%</span> and <span className="font-semibold text-gray-900">100.00%</span>.
              </p>
            </div>
          </div>

          {/* 2. INPUT SCORECARD ENTRY - Nhập thẳng tỷ lệ % */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Recorded Defect Rate (%)
            </label>
            <div className="relative">
              <input
                type="text"
                disabled={isProcessing}
                value={percentValue}
                onChange={(e) => handlePercentChange(e.target.value)}
                placeholder="0.00"
                className="w-full bg-white text-gray-900 placeholder-gray-400 font-mono rounded-md pl-4 pr-10 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-800/20 transition-all disabled:bg-gray-50 disabled:text-gray-400 disabled:pointer-events-none"
              />
              <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-sm font-mono font-bold text-gray-400 pointer-events-none">
                %
              </span>
            </div>
          </div>

          {/* 3. IMMUTABLE AUDIT DATA BOX (Khối thông tin phụ trợ phẳng tinh gọn) */}
          <div className="rounded-md bg-gradient-to-br from-white to-blue-50/20 p-4 space-y-2.5 font-mono text-xs text-gray-400">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100/70">
              <span className="font-sans font-medium text-gray-500">Auto-Resolved Basis Points (BPS):</span>
              <span className="font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded-md font-mono">
                {percentValue ? Math.round(parseFloat(percentValue) * 100) : 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-sans font-medium text-gray-500">Target Supply Identity:</span>
              <span className="font-bold text-gray-900 max-w-[200px] truncate" title={registration?.supplier?.walletAddress}>
                {registration?.supplier?.walletAddress || "Context Not Loaded"}
              </span>
            </div>
          </div>

          {/* 4. CONTROL OPERATORS (Khu vực nút tương tác phẳng loại bỏ border-t thô) */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => setOpen(false)}
              className="flex items-center justify-center bg-white text-blue-800 font-medium px-4 py-2 rounded-md transition-all duration-200 hover:bg-blue-50 active:scale-[0.98] text-sm disabled:opacity-30 disabled:pointer-events-none"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              disabled={!percentValue || isProcessing || !registration?.supplier?.walletAddress}
              className="flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white font-medium px-5 py-2 rounded-md shadow-sm transition-all duration-200 hover:brightness-110 active:scale-[0.98] text-sm disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 disabled:pointer-events-none flex items-center gap-1.5"
            >
              {isChainPending ? (
                <>
                  <span className="inline-block animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
                  <span>Signing Matrix...</span>
                </>
              ) : isBackendPending ? (
                <>
                  <span className="inline-block animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
                  <span>Syncing Ledger...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Seal Inspection</span>
                </>
              )}
            </button>
          </div>

        </div>
      </Modal>
    </>
  );
};

export default CompleteInspectionButton;