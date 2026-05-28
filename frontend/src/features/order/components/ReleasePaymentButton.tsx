// components/Procurement/ReleasePaymentButton.tsx

import React, { useState } from "react";
import {
  CircleDollarSign,
  AlertTriangle,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import Modal from "../../../shared/ui/modal/Modal";
import { useReleaseSupplierPayment as useReleaseSupplierPaymentBackend } from "../hooks/use-order";
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

const ReleasePaymentButton = ({ contract, registration }: Props) => {
  const [open, setOpen] = useState(false);

  // =========================================================
  // HOOKS & ASYNC PIPELINES
  // =========================================================
  const procurement = useProcurement(contract?.address);
  const backend = useReleaseSupplierPaymentBackend();

  const isChainPending = procurement.releaseSupplierPayment.isPending;
  const isBackendPending = backend.isPending;
  const isProcessing = isChainPending || isBackendPending;

  // =========================================================
  // HYBRID TRANSACTION FLOW ORCHESTRATOR
  // =========================================================
  const handleConfirm = async () => {
    if (!registration?.supplier?.walletAddress) return;

    try {
      // 1. BLOCKCHAIN MUTATION: DISPATCH ON-CHAIN TRANSACTION WRITER
      const txHash = await procurement.releaseSupplierPayment.mutateAsync(
        registration.supplier.walletAddress,
      );

      // 2. BACKEND MUTATION: EXECUTE RELATIONAL SYSTEM RECONCILIATION
      await backend.mutateAsync({
        id: registration.order?.id,
        contractId: contract.id,
        data: {
          txHash,
          contractAddress: contract.address,
        },
      });

      // Clear state context boundaries on full system success block
      setOpen(false);
    } catch (error) {
      console.error(
        "Critical: Escrow asset dispatch pipeline caught runtime error:",
        error,
      );
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
          from-indigo-950 via-indigo-900 to-slate-900 px-4 py-2 text-sm
          font-medium text-white shadow-sm transition-all duration-200
          hover:brightness-110 hover:shadow-md active:scale-[0.98]
        "
      >
        <CircleDollarSign className="w-4 h-4" strokeWidth={2} />
        <span>Release Payment</span>
      </button>

      {/* MODAL WINDOW */}
      <Modal
        open={open}
        onClose={() => !isProcessing && setOpen(false)}
        title="Execute Smart Escrow Clearance"
      >
        <div className="space-y-5 text-left font-sans">
          {/* HARD SYSTEM REVERSAL CRITICAL NOTICE */}
          <div className="rounded-md border border-amber-200 bg-amber-50/40 p-4 flex gap-3">
            <AlertTriangle
              className="w-5 h-5 text-amber-700 shrink-0 mt-0.5"
              strokeWidth={2}
            />
            <div className="space-y-1">
              <p className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                Irreversible Financial Action
              </p>
              <p className="text-xs text-gray-600 leading-relaxed">
                Confirming this routine initiates an immutable settlement
                transaction route. This will permanently unlock vault assets and
                distribute capital to the supplier identity on-chain. **This
                sequence cannot be reversed.**
              </p>
            </div>
          </div>

          {/* TARGET METADATA CARD */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-400">
              <Wallet className="w-3.5 h-3.5 text-gray-400" />
              Creditor Allocation Target
            </label>

            <div className="rounded-md border border-slate-100 bg-slate-50/60 p-3.5 space-y-1.5 font-mono text-xs">
              <div className="flex justify-between text-gray-500">
                <span>Supplier Account:</span>
                <span
                  className="font-bold text-slate-800 max-w-[220px] truncate"
                  title={registration?.supplier?.walletAddress}
                >
                  {registration?.supplier?.walletAddress || "Missing Address"}
                </span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Associated Sub-Order:</span>
                <span className="font-bold text-indigo-900">
                  {registration?.order?.id || "N/A"}
                </span>
              </div>
            </div>
          </div>

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
              disabled={isProcessing || !registration?.supplier?.walletAddress}
              className="
                rounded-md bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 px-5 py-2 text-sm
                font-bold text-white shadow-sm transition-all hover:brightness-110
                disabled:from-slate-100 disabled:to-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed
                flex items-center gap-1.5
              "
            >
              {isChainPending ? (
                <>
                  <span className="inline-block animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
                  <span>Signing Vault...</span>
                </>
              ) : isBackendPending ? (
                <>
                  <span className="inline-block animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
                  <span>Syncing Ledger...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authorize Release</span>
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ReleasePaymentButton;
