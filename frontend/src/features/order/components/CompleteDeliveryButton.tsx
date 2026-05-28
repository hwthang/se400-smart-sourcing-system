// components/Delivery/CompleteDeliveryButton.tsx

import React, { useState, useMemo } from "react";
import { CheckCircle2, Clock, ShieldCheck, AlertTriangle } from "lucide-react";
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
      {/* TRIGGER CONTROL */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="
          flex items-center gap-2 rounded-md bg-gradient-to-br
          from-emerald-800 via-emerald-700 to-teal-900 px-4 py-2 text-sm
          font-medium text-white shadow-sm transition-all duration-200
          hover:brightness-110 hover:shadow-md active:scale-[0.98]
        "
      >
        <CheckCircle2 className="w-4 h-4" strokeWidth={2} />
        <span>Complete Delivery</span>
      </button>

      {/* DUAL-STAGE SYSTEM MODAL */}
      <Modal
        open={open}
        onClose={() => !isProcessing && setOpen(false)}
        title="Execute Delivery Fulfillment Certificate"
      >
        <div className="space-y-5 text-left font-sans">
          
          {/* ARCHITECTURE TRANSACTIONAL WARNING */}
          <div className="rounded-md border border-emerald-100 bg-emerald-50/40 p-4 flex gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" strokeWidth={2} />
            <div className="space-y-1">
              <p className="text-xs font-bold text-emerald-900 uppercase tracking-wide">
                Dual-Stage Ledger Pipeline
              </p>
              <p className="text-xs text-gray-600 leading-relaxed">
                Submitting this validation triggers an immediate on-chain settlement sequence. Ensure your wallet provider is active for contract gas authentication.
              </p>
            </div>
          </div>

          {/* DATETIME FIELD ENTRY */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-400">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              Arrival Timestamp Specification
            </label>
            <input
              type="datetime-local"
              disabled={isProcessing}
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              className="
                w-full rounded-md border border-gray-200 bg-white px-4 py-2.5 text-sm font-mono text-gray-900 shadow-sm
                transition-all focus:outline-none focus:ring-4 focus:ring-emerald-800/10 focus:border-emerald-800
                disabled:bg-slate-50 disabled:text-gray-400 disabled:cursor-not-allowed
              "
            />
          </div>

          {/* IMMUTABLE AUDIT DATA BOX */}
          {timestamp && (
            <div className="rounded-md border border-slate-100 bg-slate-50/60 p-3 space-y-2 font-mono text-xs text-gray-500">
              <div className="flex justify-between items-center">
                <span>Evaluated Unix Code:</span>
                <span className="font-bold text-slate-800 bg-slate-200/60 px-1.5 py-0.5 rounded border border-slate-200/40">
                  {timestamp}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Resolved Provider Address:</span>
                <span className="font-bold text-slate-700 max-w-[180px] truncate" title={registration?.supplier?.walletAddress}>
                  {registration?.supplier?.walletAddress || "Missing Wallet Context"}
                </span>
              </div>
            </div>
          )}

          {/* CONTROL SCHEDULERS */}
          <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => setOpen(false)}
              className="
                rounded-md bg-white border border-gray-200 px-4 py-2 text-sm font-medium text-gray-500 
                transition-colors hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed
              "
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              disabled={!timestamp || isProcessing || !registration?.supplier?.walletAddress}
              className="
                rounded-md bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-900 px-5 py-2 text-sm
                font-bold text-white shadow-sm transition-all hover:brightness-110
                disabled:from-slate-100 disabled:to-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed
                flex items-center gap-1.5
              "
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
                  <CheckCircle2 className="w-4 h-4" />
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