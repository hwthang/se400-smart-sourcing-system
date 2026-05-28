// components/UpdateDemandButton.tsx

import React, { useState, useEffect } from "react";
import { Pencil, Calendar, Boxes, FileText, AlertCircle } from "lucide-react";
import Modal from "../../../shared/ui/modal/Modal";
import { useUpdateDemand } from "../hooks/use-demand";

type Props = {
  demand: any;
};

const UpdateDemandButton = ({ demand }: Props) => {
  const updateMutation = useUpdateDemand();
  const [open, setOpen] = useState(false);

  // =========================================================
  // FORM STATES
  // =========================================================
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [deliveryDate, setDeliveryDate] = useState("");

  // Đồng bộ hóa dữ liệu từ props vào form state khi mở Modal
  useEffect(() => {
    if (open && demand) {
      setName(demand.product?.name || "");
      setQuantity(demand.requestedQuantity || 0);
      
      // Chuyển đổi định dạng Date sang chuỗi YYYY-MM-DD để hiển thị trên thẻ <input type="date" />
      if (demand.requestedDeliveryDate) {
        const dateObj = new Date(demand.requestedDeliveryDate);
        if (!isNaN(dateObj.getTime())) {
          setDeliveryDate(dateObj.toISOString().split("T")[0]);
        }
      } else {
        setDeliveryDate("");
      }
    }
  }, [open, demand]);

  const isProcessing = updateMutation.isPending;

  // =========================================================
  // HANDLER
  // =========================================================
  const handleConfirm = () => {
    if (!name.trim() || quantity <= 0) return;

    updateMutation.mutate(
      {
        id: demand?.id,
        data: {
          product: {
            name: name.trim(),
            description: demand?.product?.description,
            sku: demand?.product?.sku,
            specifications: demand?.product?.specifications,
          },
          requestedQuantity: Number(quantity),
          requestedDeliveryDate: deliveryDate ? new Date(deliveryDate) : null,
        },
      },
      {
        onSuccess: () => {
          setOpen(false);
        },
      },
    );
  };

  return (
    <>
      {/* TRIGGER BUTTON */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="
          flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-white
          px-4 py-2 text-sm font-medium text-blue-800 shadow-sm transition-all
          duration-200 hover:bg-blue-50 hover:shadow-md active:scale-[0.98]
        "
      >
        <Pencil className="w-4 h-4" strokeWidth={2} />
        <span>Update Demand</span>
      </button>

      {/* EDIT & CONFIRM MODAL */}
      <Modal 
        open={open} 
        onClose={() => !isProcessing && setOpen(false)} 
        title="Modify Procurement Demand"
      >
        <div className="space-y-5 text-left">
          
          {/* BANNER THÔNG BÁO */}
          <div className="rounded-md border border-blue-100 bg-blue-50/40 p-3.5 flex gap-2.5">
            <AlertCircle className="w-4 h-4 text-blue-800 shrink-0 mt-0.5" strokeWidth={2} />
            <p className="text-xs text-blue-900 leading-relaxed">
              Modifying these requirements will update the active procurement draft. Parameters will be re-validated by the system sourcing pipeline upon submission.
            </p>
          </div>

          {/* FORM FIELDS */}
          <div className="space-y-4">
            {/* PRODUCT NAME */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-500">
                <FileText className="w-3.5 h-3.5 text-gray-400" />
                Product Name
              </label>
              <input
                type="text"
                className="
                  w-full rounded-md border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 shadow-sm
                  transition-all focus:outline-none focus:ring-4 focus:ring-blue-800/10 focus:border-blue-800
                "
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Industrial Steel Pipes"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* REQUESTED QUANTITY */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-500">
                  <Boxes className="w-3.5 h-3.5 text-gray-400" />
                  Quantity
                </label>
                <input
                  type="number"
                  min={1}
                  className="
                    w-full rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-mono text-gray-900 shadow-sm
                    transition-all focus:outline-none focus:ring-4 focus:ring-blue-800/10 focus:border-blue-800
                  "
                  value={quantity || ""}
                  onChange={(e) => setQuantity(Math.max(0, Number(e.target.value)))}
                  placeholder="0"
                />
              </div>

              {/* DELIVERY DATE */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-500">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  Delivery Date
                </label>
                <input
                  type="date"
                  className="
                    w-full rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-mono text-gray-900 shadow-sm
                    transition-all focus:outline-none focus:ring-4 focus:ring-blue-800/10 focus:border-blue-800
                  "
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex justify-end gap-2 border-t border-gray-100 pt-4 mt-2">
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
              onClick={handleConfirm}
              disabled={isProcessing || !name.trim() || quantity <= 0}
              className="
                rounded-md bg-gradient-to-br from-blue-900 to-indigo-900 px-5 py-2 text-sm
                font-bold text-white shadow-sm transition-all hover:brightness-110
                disabled:from-slate-100 disabled:to-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed
                flex items-center gap-1.5
              "
            >
              {isProcessing ? (
                <>
                  <span className="inline-block animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <span>Save & Confirm</span>
              )}
            </button>
          </div>

        </div>
      </Modal>
    </>
  );
};

export default UpdateDemandButton;