// components/Inspection/StartInspectionButton.tsx

import React, { useState } from "react";
import { ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react";
import Modal from "../../../shared/ui/modal/Modal";
import { useStartInspection } from "../hooks/use-order";

type Props = {
  contract: {
    id: string;
  };
  registration: {
    order?: {
      id: string;
    };
  };
};

const StartInspectionButton = ({ contract, registration }: Props) => {
  const [open, setOpen] = useState(false);
  const startInspection = useStartInspection();

  const isProcessing = startInspection.isPending;

  const handleConfirm = async () => {
    try {
      await startInspection.mutateAsync({
        id: registration?.order?.id,
        contractId: contract?.id,
      });
      setOpen(false);
    } catch (error) {
      console.error("Failed to initiate batch inspection pipeline:", error);
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
        <ShieldCheck className="w-4 h-4" strokeWidth={2} />
        <span>Start Inspection</span>
      </button>

      {/* COMPLIANCE MODAL */}
      <Modal
        open={open}
        onClose={() => !isProcessing && setOpen(false)}
        title="Initialize Quality Inspection Audit"
      >
        <div className="space-y-5 text-left font-sans">
          
          {/* STATE TRANSITION NOTICE */}
          <div className="rounded-md border border-indigo-100 bg-indigo-50/40 p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-indigo-900 shrink-0 mt-0.5" strokeWidth={2} />
            <div className="space-y-1">
              <p className="text-xs font-bold text-indigo-950 uppercase tracking-wide">
                Quality Assurance Protocol
              </p>
              <p className="text-xs text-gray-600 leading-relaxed">
                Are you sure you want to initialize the quality evaluation cycle for this batch? This will shift the lot status to <span className="font-mono font-bold text-indigo-950 bg-indigo-50 border border-indigo-100 px-1 py-0.5 rounded">UNDER_INSPECTION</span> and open the metric scorecard recording gates.
              </p>
            </div>
          </div>

          {/* AUDIT CODES PREVIEW */}
          <div className="rounded-md border border-slate-100 bg-slate-50/50 px-4 py-3 space-y-1.5 font-mono text-xs text-gray-500">
            <div className="flex justify-between">
              <span>Target Lot Order:</span>
              <span className="font-bold text-slate-700">{registration?.order?.id || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span>Ledger Context:</span>
              <span className="font-bold text-indigo-900">{contract?.id || "N/A"}</span>
            </div>
          </div>

          {/* CONTROLS SLOTS */}
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
              disabled={isProcessing || !registration?.order?.id}
              className="
                rounded-md bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 px-5 py-2 text-sm
                font-bold text-white shadow-sm transition-all hover:brightness-110
                disabled:from-slate-100 disabled:to-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed
                flex items-center gap-1.5
              "
            >
              {isProcessing ? (
                <>
                  <span className="inline-block animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
                  <span>Locking Status...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Authorize Inspection</span>
                </>
              )}
            </button>
          </div>

        </div>
      </Modal>
    </>
  );
};

export default StartInspectionButton;