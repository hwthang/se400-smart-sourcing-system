// components/UpdateBuyerCriteriaButton.tsx

import { useState, useEffect } from "react";
import { Pencil, Info } from "lucide-react";
import Modal from "../../../shared/ui/modal/Modal";
import { useUpdateCriteria } from "../hooks/use-buyer-criteria";

type Props = {
  criteriaId: string;
  contractId: string;
  defaultValues?: {
    minPurchaseQuantity?: number;
    maxAllocationPercent?: number;
  };
};

const UpdateBuyerCriteriaButton = ({
  criteriaId,
  contractId,
  defaultValues,
}: Props) => {
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    minPurchaseQuantity: defaultValues?.minPurchaseQuantity || 0,
    maxAllocationPercent: defaultValues?.maxAllocationPercent || 0,
  });

  const updateCriteria = useUpdateCriteria();

  // Đồng bộ lại dữ liệu form mỗi khi mở Modal hoặc dữ liệu mặc định được tải xong
  useEffect(() => {
    if (open && defaultValues) {
      setForm({
        minPurchaseQuantity: defaultValues.minPurchaseQuantity || 0,
        maxAllocationPercent: defaultValues.maxAllocationPercent || 0,
      });
    }
  }, [open, defaultValues]);

  // Hàm tính toán hiển thị phần trăm real-time dựa trên số nguyên đang nhập (cơ số 10000)
  const formatLivePercent = (value: number) => {
    if (!value || isNaN(value)) return "0.00%";
    return `${(value / 100).toFixed(2)}%`;
  };

  const handleSubmit = async () => {
    await updateCriteria.mutateAsync({
      id: criteriaId,
      contractId,
      data: form,
    });

    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="
          flex items-center gap-2 rounded-md border border-gray-200 bg-white
          px-4 py-2 text-sm font-medium text-blue-800 shadow-sm transition-all
          duration-200 hover:bg-blue-50 hover:shadow-md active:scale-[0.98]
        "
      >
        <Pencil className="w-4 h-4" strokeWidth={2} />
        <span>Update Criteria</span>
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Update Buyer Criteria">
        <div className="flex flex-col gap-5">
          
          {/* MIN PURCHASE QUANTITY */}
          <div className="text-left space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Minimum Purchase Quantity
            </label>
            <input
              type="number"
              min={0}
              value={form.minPurchaseQuantity || ""}
              onChange={(e) => {
                const val = Math.max(0, Number(e.target.value));
                setForm((prev) => ({ ...prev, minPurchaseQuantity: val }));
              }}
              placeholder="Enter minimum quantity"
              className="
                w-full rounded-md border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm
                transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-800/10 focus:border-blue-800
              "
            />
          </div>

          {/* MAX ALLOCATION PERCENT */}
          <div className="text-left space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1">
                Max Allocation Percent <span className="text-gray-400 font-normal">(0 - 10000)</span>
              </label>
              
              {/* LIVE CONVERSION BADGE */}
              <span className="text-sm font-mono font-black text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 shadow-2xs">
                Preview: {formatLivePercent(form.maxAllocationPercent)}
              </span>
            </div>

            <input
              type="number"
              min={0}
              max={10000}
              value={form.maxAllocationPercent || ""}
              onChange={(e) => {
                let val = Number(e.target.value);
                // Giới hạn cứng trong khoảng từ 0 đến 10000 bảo vệ biên dữ liệu
                if (val > 10000) val = 10000;
                if (val < 0) val = 0;
                
                setForm((prev) => ({
                  ...prev,
                  maxAllocationPercent: val,
                }));
              }}
              placeholder="Enter value between 0 and 10000"
              className="
                w-full rounded-md border border-gray-200 bg-white px-4 py-2.5 text-sm font-mono text-gray-900 shadow-sm
                transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-800/10 focus:border-blue-800
              "
            />
          </div>

          {/* HINT QUY ĐỔI THEO CHUẨN ĐỘ CHÍNH XÁC SMART CONTRACT */}
          <div className="rounded-md border border-blue-100 bg-blue-50/40 p-4 text-left space-y-3">
            <div className="flex items-center gap-2 text-blue-900">
              <Info className="w-4 h-4 shrink-0" strokeWidth={2} />
              <p className="text-xs font-bold uppercase tracking-wide">
                On-Chain Precision Rules
              </p>
            </div>
            
            <p className="text-xs text-gray-500 leading-relaxed">
              Smart Contracts count percentages in base basis points ($10000 = 100.00\%$) to avoid precision handling issues with decimals. Refer to this conversion matrix:
            </p>

            {/* BẢNG QUY ĐỔI MA TRẬN NHANH */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono border-t border-blue-100/70 pt-2.5">
              <div className="bg-white p-1.5 rounded border border-slate-100">
                <p className="text-[10px] text-gray-400 uppercase">Input</p>
                <p className="font-bold text-gray-800 mt-0.5">10000</p>
                <p className="text-[11px] text-blue-900 font-semibold mt-0.5">100.00%</p>
              </div>
              <div className="bg-white p-1.5 rounded border border-slate-100">
                <p className="text-[10px] text-gray-400 uppercase">Input</p>
                <p className="font-bold text-gray-800 mt-0.5">2550</p>
                <p className="text-[11px] text-blue-900 font-semibold mt-0.5">25.50%</p>
              </div>
              <div className="bg-white p-1.5 rounded border border-slate-100">
                <p className="text-[10px] text-gray-400 uppercase">Input</p>
                <p className="font-bold text-gray-800 mt-0.5">50</p>
                <p className="text-[11px] text-blue-900 font-semibold mt-0.5">0.50%</p>
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={updateCriteria.isPending}
              className="
                rounded-md bg-gradient-to-br from-blue-900 to-indigo-900 px-5 py-2 text-sm
                font-medium text-white shadow-sm transition-all hover:brightness-110
                disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed
              "
            >
              {updateCriteria.isPending ? "Updating..." : "Confirm"}
            </button>
          </div>

        </div>
      </Modal>
    </>
  );
};

export default UpdateBuyerCriteriaButton;