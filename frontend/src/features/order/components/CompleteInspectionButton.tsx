// components/Inspection/CompleteInspectionButton.tsx

import React, { useState, useMemo } from "react";
import { ShieldCheck, AlertCircle, Percent, CheckCircle2 } from "lucide-react";
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
  const [value, setValue] = useState("");

  // =========================================================
  // CORE BLOCKCHAIN & BACKEND ASYNC MUTATIONS
  // =========================================================
  const procurement = useProcurement(contract?.address);
  const backend = useCompleteInspectionBackend();

  const isChainPending = procurement.completeInspection.isPending;
  const isBackendPending = backend.isPending;
  const isProcessing = isChainPending || isBackendPending;

  // =========================================================
  // BASIS POINT PARSING (0 - 10000 => 0.00% - 100.00%)
  // =========================================================
  const percent = useMemo(() => {
    const numericValue = Number(value);
    if (value === "" || isNaN(numericValue)) return null;
    if (numericValue < 0 || numericValue > 10000) return "INVALID";
    return (numericValue / 100).toFixed(2);
  }, [value]);

  // =========================================================
  // HYBRID STATE TRANSACTION PIPELINE
  // =========================================================
  const handleConfirm = async () => {
    const numericValue = Number(value);
    if (
      value === "" || 
      isNaN(numericValue) || 
      numericValue < 0 || 
      numericValue > 10000 ||
      !registration?.supplier?.walletAddress
    ) return;

    try {
      const defectRate = BigInt(value); // Mapping directly to Solidity uint256

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
      setValue("");
    } catch (error) {
      console.error("Fulfillment evaluation pipeline failed:", error);
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
          from-amber-800 via-amber-700 to-orange-900 px-4 py-2 text-sm
          font-medium text-white shadow-sm transition-all duration-200
          hover:brightness-110 hover:shadow-md active:scale-[0.98]
        "
      >
        <ShieldCheck className="w-4 h-4" strokeWidth={2} />
        <span>Complete Inspection</span>
      </button>

      {/* COMPLIANCE AUDIT MODAL */}
      <Modal
        open={open}
        onClose={() => !isProcessing && setOpen(false)}
        title="Finalize Quality Inspection Ledger"
      >
        <div className="space-y-5 text-left font-sans">
          
          {/* HARD VALIDATION WARNING BANNER */}
          <div className="rounded-md border border-amber-100 bg-amber-50/40 p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" strokeWidth={2} />
            <div className="space-y-1">
              <p className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                Basis Points Invariant Check
              </p>
              <p className="text-xs text-gray-600 leading-relaxed">
                Defect rate parameter inputs are measured in basis points (BPS). Input bounds must fall explicitly within <span className="font-mono font-bold text-amber-950 bg-amber-50 px-1 py-0.5 rounded">0</span> and <span className="font-mono font-bold text-amber-950 bg-amber-50 px-1 py-0.5 rounded">10000</span> ($100.00\%$ absolute maximum fallback penalty).
              </p>
            </div>
          </div>

          {/* INPUT SCORECARD ENTRY */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-400">
              <Percent className="w-3.5 h-3.5 text-gray-400" />
              Recorded Metric (BPS Value)
            </label>
            <input
              type="number"
              min={0}
              max={10000}
              disabled={isProcessing}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="
                w-full rounded-md border border-gray-200 bg-white px-4 py-2.5 text-sm font-mono text-gray-900 shadow-sm
                transition-all focus:outline-none focus:ring-4 focus:ring-amber-800/10 focus:border-amber-800
                disabled:bg-slate-50 disabled:text-gray-400 disabled:cursor-not-allowed
              "
              placeholder="e.g. 250 = 2.50%"
            />
          </div>

          {/* MATURED REAL-TIME PREVIEW DATA BLOCK */}
          {percent !== null && (
            <div className="rounded-md border border-slate-100 bg-slate-50/60 p-3 space-y-2 font-mono text-xs text-gray-500">
              <div className="flex justify-between items-center">
                <span>Calculated Baseline Metric:</span>
                <span className={`font-bold text-sm px-2 py-0.5 rounded border ${
                  percent === "INVALID" 
                    ? "bg-rose-50 text-rose-700 border-rose-200" 
                    : "bg-amber-50 text-amber-800 border-amber-200"
                }`}>
                  {percent === "INVALID" ? "Out of Bounds" : `${percent}%`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Target Supply Identity:</span>
                <span className="font-bold text-slate-700 max-w-[180px] truncate" title={registration?.supplier?.walletAddress}>
                  {registration?.supplier?.walletAddress || "Context Not Loaded"}
                </span>
              </div>
            </div>
          )}

          {/* CONTROL OPERATORS */}
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
              disabled={!value || percent === "INVALID" || isProcessing || !registration?.supplier?.walletAddress}
              className="
                rounded-md bg-gradient-to-br from-amber-800 via-amber-700 to-orange-900 px-5 py-2 text-sm
                font-bold text-white shadow-sm transition-all hover:brightness-110
                disabled:from-slate-100 disabled:to-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed
                flex items-center gap-1.5
              "
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
                  <CheckCircle2 className="w-4 h-4" />
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