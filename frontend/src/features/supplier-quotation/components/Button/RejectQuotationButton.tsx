// components/Button/RejectQuotationButton.tsx

import React, { useState } from "react";
import { XCircle, AlertCircle } from "lucide-react";
import Modal from "../../../../shared/ui/modal/Modal";
import { useRejectQuotation } from "../../hooks/use-supplier-quotation";

type Props = {
  registration: any;
};

const RejectQuotationButton = ({ registration }: Props) => {
  const rejectQuotation = useRejectQuotation();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");

  const quotation = registration?.quotation;

  // Kiểm tra điều kiện active nút bấm (Bắt buộc phải gõ lý do mới cho reject)
  const isFormValid = reason.trim().length > 0;

  const handleReject = () => {
    if (!isFormValid) return;

    rejectQuotation.mutate(
      {
        id: quotation.id,
        contractId: registration.contractId,
        reason: reason.trim(), // Truyền thêm lý do từ chối lên API/Smart Contract backend
      },
      {
        onSuccess: () => {
          setOpen(false);
          setReason(""); // Reset lại form nhập lý do
        },
      }
    );
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="
          rounded-md
          bg-red-50
          px-4
          py-2
          text-sm
          font-medium
          text-red-700
          transition-all
          hover:bg-red-100
          active:scale-[0.98]
        "
      >
        <div className="flex items-center gap-2">
          <XCircle className="w-4 h-4" strokeWidth={2} />
          Reject
        </div>
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Reject Quotation">
        <div className="space-y-5">
          {/* BANNER THÔNG BÁO CẢNH BÁO */}
          <div className="rounded-md border border-red-100 bg-red-50/60 p-4 text-left flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" strokeWidth={2} />
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-red-800">Action Warning</p>
              <p className="text-xs text-red-700/90 leading-relaxed">
                Rejecting this quotation will return it to the supplier revision state. The supplier will be notified to modify their pricing or parameters based on your feedback.
              </p>
            </div>
          </div>

          {/* Ô NHẬP REASON */}
          <div className="space-y-2 text-left">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center justify-between">
              <span>Rejection Reason <span className="text-red-500">*</span></span>
              <span className="text-[10px] font-normal text-gray-400 lowercase">
                {reason.trim().length} chars
              </span>
            </label>
            <textarea
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please detail why this quotation is being rejected (e.g., Defect rate too high, Unit price exceeds target allocation budget, etc.)..."
              className="
                w-full
                rounded-md
                bg-white
                px-3
                py-2
                text-sm
                text-gray-900
                placeholder-gray-400
                shadow-sm
                outline-none
                border
                border-gray-200
                transition-all
                focus:border-red-500
                focus:ring-4
                focus:ring-red-500/10
                resize-none
              "
            />
          </div>

          {/* NHÓM NÚT ĐIỀU HƯỚNG */}
          <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setReason(""); // Reset khi hủy
              }}
              className="rounded-md px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleReject}
              disabled={!isFormValid || rejectQuotation.isPending}
              className="
                rounded-md
                bg-red-600
                px-4
                py-2
                text-sm
                font-medium
                text-white
                transition-colors
                hover:bg-red-700
                disabled:bg-slate-100
                disabled:text-slate-400
                disabled:cursor-not-allowed
                shadow-sm
              "
            >
              {rejectQuotation.isPending ? "Rejecting..." : "Confirm Reject"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default RejectQuotationButton;