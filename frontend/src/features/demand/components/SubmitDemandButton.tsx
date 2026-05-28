// components/SubmitDemandButton.tsx

import React, { useState } from "react";
import { Send, AlertCircle } from "lucide-react";
import Modal from "../../../shared/ui/modal/Modal";
import { useSubmitDemand } from "../hooks/use-demand";

type Props = {
  demandId: string;
};

const SubmitDemandButton = ({ demandId }: Props) => {
  const [open, setOpen] = useState(false);
  const submitMutation = useSubmitDemand();

  const isProcessing = submitMutation.isPending;

  const handleSubmit = () => {
    submitMutation.mutate(demandId, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  };

  return (
    <>
      {/* TRIGGER BUTTON */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="
          flex items-center justify-center gap-2 rounded-md bg-gradient-to-br
          from-emerald-700 to-emerald-600 px-4 py-2 text-sm
          font-medium text-white shadow-sm transition-all duration-200
          hover:brightness-110 hover:shadow-md active:scale-[0.98]
        "
      >
        <Send className="w-4 h-4" strokeWidth={2} />
        <span>Submit Demand</span>
      </button>

      {/* CONFIRMATION MODAL */}
      <Modal 
        open={open} 
        onClose={() => !isProcessing && setOpen(false)} 
        title="Submit Procurement Demand"
      >
        <div className="space-y-5 text-left">
          
          {/* NOTICE BANNER */}
          <div className="rounded-md border border-amber-100 bg-amber-50/50 p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" strokeWidth={2} />
            <div className="space-y-1">
              <p className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                State Transition Notice
              </p>
              <p className="text-xs text-gray-600 leading-relaxed">
                Are you sure you want to transition this procurement demand to the <span className="font-mono font-bold text-slate-900 bg-slate-100 px-1 py-0.5 rounded">SUBMITTED</span> state? 
                Once submitted, allocation routing rules and constraint validation filters will lock to prepare for smart sourcing execution.
              </p>
            </div>
          </div>

          {/* ACTION BUTTONS CONTROLS */}
          <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
            <button
              type="button"
              disabled={isProcessing}
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
              onClick={handleSubmit}
              disabled={isProcessing}
              className="
                rounded-md bg-gradient-to-br from-emerald-700 to-emerald-600 px-5 py-2 text-sm
                font-bold text-white shadow-sm transition-all hover:brightness-110
                disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5
              "
            >
              {isProcessing ? (
                <>
                  <span className="inline-block animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent" />
                  <span>Submitting...</span>
                </>
              ) : (
                <span>Confirm & Submit</span>
              )}
            </button>
          </div>

        </div>
      </Modal>
    </>
  );
};

export default SubmitDemandButton;