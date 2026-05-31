// components/Delivery/CompleteDeliveryButton.tsx

import React, { useState, useMemo, useEffect } from "react";
import { CheckCircle2, Clock, ShieldCheck } from "lucide-react";
import Modal from "../../../shared/ui/modal/Modal";
import { useProcurement } from "../../../core/blockchain/hooks/useProcurement";
import { useCompleteDelivery } from "../hooks/use-order";

type Props = {
  contract: {
    id: string;
    address: string;
  };
  registration: {
    id?: string;
    supplier?: {
      walletAddress: string;
    };
    order?: {
      id: string;
    };
  };
};

const CompleteDeliveryButton = ({ contract, registration }: Props) => {
  const [open, setOpen] = useState(false);
  const [dateTime, setDateTime] = useState("");

  // =========================================================
  // CORE TRANSACTION & BACKEND MUTATIONS
  // =========================================================
  const procurement = useProcurement(contract?.address);
  const completeDelivery = useCompleteDelivery();

  const isChainPending = procurement.completeDelivery.isPending;
  const isBackendPending = completeDelivery.isPending;
  const isProcessing = isChainPending || isBackendPending;

  // =========================================================
  // AUTO-FILL CURRENT LOCAL DATETIME
  // =========================================================
  useEffect(() => {
    if (open && !dateTime) {
      const now = new Date();
      
      // Chuyển đổi sang định dạng YYYY-MM-DDTHH:mm chuẩn ISO local phục vụ ô input datetime-local
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      
      setDateTime(`${year}-${month}-${day}T${hours}:${minutes}`);
    }
  }, [open, dateTime]);

  // =========================================================
  // PARSING UNIX TIMESTAMP
  // =========================================================
  const timestamp = useMemo(() => {
    if (!dateTime) return null;
    const calculatedUnix = Math.floor(new Date(dateTime).getTime() / 1000);
    return isNaN(calculatedUnix) ? null : calculatedUnix;
  }, [dateTime]);

  // =========================================================
  // HYBRID STATE ORCHESTRATOR
  // =========================================================
  const handleConfirm = async () => {
    if (!timestamp || !registration?.supplier?.walletAddress) return;

    try {
      // 1. ONAUTHENTICATED BLOCKCHAIN WRITER EXECUTION
      const txHash = await procurement.completeDelivery.mutateAsync({
        supplier: registration.supplier.walletAddress,
        deliveryTimestamp: BigInt(timestamp),
      });

      // 2. SYNCHRONOUS BACKEND LEDGER RECONCILIATION
      await completeDelivery.mutateAsync({
        id: registration?.order?.id,
        contractId: contract?.id,
        data: {
          txHash,
          contractAddress: contract?.address,
        },
      });

      // Reset application state scope on absolute lifecycle completion
      setOpen(false);
      setDateTime("");
    } catch (error) {
      console.error("Hybrid state pipeline execution halted:", error);
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
        <CheckCircle2 className="w-4 h-4 text-white" strokeWidth={2} />
        <span>Complete Delivery</span>
      </button>

      {/* DUAL-STAGE SYSTEM MODAL */}
      <Modal
        open={open}
        onClose={() => !isProcessing && setOpen(false)}
        title="Execute Delivery Fulfillment Certificate"
      >
        <div className="space-y-5 text-left">
          
          {/* 1. ARCHITECTURE TRANSACTIONAL WARNING (Borderless PureBlue Block) */}
          <div className="rounded-md bg-blue-50/50 p-4 flex gap-3">
            <ShieldCheck className="w-5 h-5 text-blue-800 shrink-0 mt-0.5" strokeWidth={2} />
            <div className="space-y-1">
              <p className="text-xs font-bold text-blue-900 uppercase tracking-wide">
                Dual-Stage Ledger Pipeline
              </p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Submitting this validation triggers an immediate on-chain settlement sequence. Ensure your wallet provider is active for contract gas authentication.
              </p>
            </div>
          </div>

          {/* 2. DATETIME FIELD ENTRY (Hỗ trợ Auto-fill & Tự chỉnh sửa) */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-500">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              Arrival Timestamp Specification
            </label>
            <input
              type="datetime-local"
              disabled={isProcessing}
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              className="w-full bg-white text-gray-900 font-mono rounded-md px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-800/20 transition-all disabled:bg-gray-50 disabled:text-gray-400 disabled:pointer-events-none"
            />
          </div>

          {/* 3. IMMUTABLE AUDIT DATA BOX (Khối hiển thị thông số phẳng tinh gọn) */}
          {timestamp && (
            <div className="rounded-md bg-gradient-to-br from-white to-blue-50/20 p-4 space-y-2.5 font-mono text-xs text-gray-400">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100/70">
                <span className="font-sans font-medium text-gray-500">Evaluated Unix Code:</span>
                <span className="font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded-md font-mono">
                  {timestamp}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-sans font-medium text-gray-500">Resolved Provider Address:</span>
                <span className="font-bold text-gray-900 max-w-[200px] truncate" title={registration?.supplier?.walletAddress}>
                  {registration?.supplier?.walletAddress || "Missing Wallet Context"}
                </span>
              </div>
            </div>
          )}

          {/* 4. CONTROL SCHEDULERS (Khu vực nút tương tác phẳng không đường kẻ thô) */}
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
              disabled={!timestamp || isProcessing || !registration?.supplier?.walletAddress}
              className="flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white font-medium px-5 py-2 rounded-md shadow-sm transition-all duration-200 hover:brightness-110 active:scale-[0.98] text-sm disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 disabled:pointer-events-none flex items-center gap-1.5"
            >
              {isChainPending ? (
                <>
                  <span className="inline-block animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
                  <span>Awaiting Sign...</span>
                </>
              ) : isBackendPending ? (
                <>
                  <span className="inline-block animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
                  <span>Syncing Ledger...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Seal Processing</span>
                </>
              )}
            </button>
          </div>

        </div>
      </Modal>
    </>
  );
};

export default CompleteDeliveryButton;