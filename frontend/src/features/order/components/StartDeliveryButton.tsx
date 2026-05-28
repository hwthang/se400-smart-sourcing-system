// components/Delivery/StartDeliveryButton.tsx

import React, { useState } from "react";
import { Truck, AlertCircle, CheckCircle2 } from "lucide-react";
import Modal from "../../../shared/ui/modal/Modal";
import { useStartDelivery } from "../hooks/use-order";

type Props = {
  orderId: string;
  contractId: string; // Bổ sung bắt buộc truyền contractId liên kết
};

const StartDeliveryButton = ({ orderId, contractId }: Props) => {
  const [open, setOpen] = useState(false);
  const startDelivery = useStartDelivery();
  console.log(orderId);

  const isProcessing = startDelivery.isPending;

  const handleConfirm = async () => {
    try {
      // Đóng gói payload gồm cả orderId và contractId truyền xuống hook mutation
      await startDelivery.mutateAsync({
        id: orderId,
        contractId,
      });
      setOpen(false);
    } catch (error) {
      console.error("Failed to transition order to delivery state:", error);
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
          from-blue-900 via-blue-800 to-indigo-900 px-4 py-2 text-sm
          font-medium text-white shadow-sm transition-all duration-200
          hover:brightness-110 hover:shadow-md active:scale-[0.98]
        "
      >
        <Truck className="w-4 h-4" strokeWidth={2} />
        <span>Start Delivery</span>
      </button>

      {/* CONFIRMATION MODAL */}
      <Modal
        open={open}
        onClose={() => !isProcessing && setOpen(false)}
        title="Dispatch Logistics Delivery"
      >
        <div className="space-y-5 text-left font-sans">
          {/* STATE TRANSITION NOTICE */}
          <div className="rounded-md border border-blue-100 bg-blue-50/40 p-4 flex gap-3">
            <AlertCircle
              className="w-5 h-5 text-blue-800 shrink-0 mt-0.5"
              strokeWidth={2}
            />
            <div className="space-y-1">
              <p className="text-xs font-bold text-blue-900 uppercase tracking-wide">
                Execution Warning
              </p>
              <p className="text-xs text-gray-600 leading-relaxed">
                Are you sure you want to transition this dispatch order to the{" "}
                <span className="font-mono font-bold text-slate-900 bg-slate-100 px-1 py-0.5 rounded">
                  IN_TRANSIT
                </span>{" "}
                state? This execution validates binding compliance under
                Contract Ledger instance.
              </p>
            </div>
          </div>

          {/* AUDIT PARAMETERS PREVIEW */}
          <div className="rounded-md border border-slate-100 bg-slate-50/50 px-4 py-3 space-y-1.5 font-mono text-xs text-gray-500">
            <div className="flex justify-between">
              <span>Target Order:</span>
              <span className="font-bold text-slate-700">{orderId}</span>
            </div>
            <div className="flex justify-between">
              <span>Binding Contract:</span>
              <span className="font-bold text-blue-900">{contractId}</span>
            </div>
          </div>

          {/* ACTION BUTTONS CONTROLS */}
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
              disabled={isProcessing}
              className="
                rounded-md bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 px-5 py-2 text-sm
                font-bold text-white shadow-sm transition-all hover:brightness-110
                disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5
              "
            >
              {isProcessing ? (
                <>
                  <span className="inline-block animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
                  <span>Dispatching...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Dispatch</span>
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default StartDeliveryButton;
